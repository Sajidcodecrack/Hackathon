const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

// Get AI pump recommendation from Gemini
const getAIRecommendation = async (pumpsData, userLocation, fuelType) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      // Fallback: local recommendation logic if no API key
      return getLocalRecommendation(pumpsData, fuelType);
    }

    const prompt = `
You are a Smart Fuel Queue Assistant for Bangladesh. Analyze these nearby fuel pumps and recommend the BEST one.

User's fuel type needed: ${fuelType}
User's location: lat ${userLocation.lat}, lng ${userLocation.lng}

Available Pumps:
${pumpsData
  .map(
    (p, i) =>
      `${i + 1}. ${p.name}
   - Distance: ${p.distance}
   - Current Queue: ${p.currentQueue} vehicles
   - Est. Wait: ${p.estimatedWait}
   - Fuel Types: ${p.fuelTypes.join(', ')}
   - Avg Service Time: ${p.avgServiceTime} min/vehicle
   - Address: ${p.address}`
  )
  .join('\n\n')}

Respond in this JSON format ONLY (no markdown, no extra text):
{
  "recommendedPumpIndex": <number (0-based index)>,
  "pumpName": "<name>",
  "reason": "<1-2 sentence reason in Bangla+English mix, casual tone>",
  "estimatedTotalTime": "<travel + wait time estimate>",
  "tips": "<helpful tip for the user>"
}
`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      }
    );

    const aiText = response.data.candidates[0].content.parts[0].text;

    // Parse JSON from response (handle potential markdown wrapping)
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return getLocalRecommendation(pumpsData, fuelType);
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    // Fallback to local logic
    return getLocalRecommendation(pumpsData, fuelType);
  }
};

// Fallback: local recommendation when Gemini is unavailable
const getLocalRecommendation = (pumpsData, fuelType) => {
  // Filter pumps that have the required fuel
  const validPumps = pumpsData.filter((p) =>
    p.fuelTypes.includes(fuelType)
  );

  if (validPumps.length === 0) {
    return {
      recommendedPumpIndex: -1,
      pumpName: 'None',
      reason: 'কোনো পাম্পে তোমার fuel type নেই।',
      estimatedTotalTime: 'N/A',
      tips: 'Try a different fuel type or wider radius.',
    };
  }

  // Score each pump: lower = better
  // Score = (distance * 2) + (queue * 3) + (avgServiceTime)
  const scored = validPumps.map((p, idx) => ({
    ...p,
    originalIndex: pumpsData.indexOf(p),
    score: p.distanceValue * 2 + p.currentQueue * 3 + p.avgServiceTime,
  }));

  scored.sort((a, b) => a.score - b.score);
  const best = scored[0];

  const travelTime = Math.ceil(best.distanceValue * 3); // ~3 min per km
  const waitTime = best.currentQueue * best.avgServiceTime;

  return {
    recommendedPumpIndex: best.originalIndex,
    pumpName: best.name,
    reason: `${best.name} সবচেয়ে ভালো — মাত্র ${best.distance} দূরে, queue-তে ${best.currentQueue} জন, আর তোমার ${fuelType} আছে।`,
    estimatedTotalTime: `~${travelTime + waitTime} min (travel ${travelTime} + wait ${waitTime})`,
    tips: best.currentQueue <= 3
      ? 'Queue কম — এখনই যাও! 🚗'
      : 'Queue একটু বেশি — slot book করে যাও ভালো হবে।',
  };
};

// Estimate waiting time for a pump
const estimateWaitTime = (currentQueue, avgServiceTime) => {
  const totalWait = currentQueue * avgServiceTime;

  let peakLevel = 'low';
  if (currentQueue > 15) peakLevel = 'high';
  else if (currentQueue > 8) peakLevel = 'medium';

  return {
    estimatedMinutes: totalWait,
    display: `${totalWait} min`,
    queueSize: currentQueue,
    peakLevel,
    suggestion:
      peakLevel === 'high'
        ? 'Peak hour! বেশি ভিড় — অন্য pump দেখো বা পরে আসো।'
        : peakLevel === 'medium'
        ? 'Moderate queue — slot book করলে ভালো।'
        : 'Queue কম! ভালো সময় fuel নেওয়ার 👍',
  };
};

module.exports = { getAIRecommendation, estimateWaitTime };
