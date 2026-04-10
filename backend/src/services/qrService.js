const QRCode = require('qrcode');

// Generate QR code as base64 data URL
const generateQR = async (payload) => {
  try {
    const qrData = JSON.stringify(payload);
    const qrImage = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    return { qrImage, qrData };
  } catch (error) {
    throw new Error('QR code generation failed');
  }
};

// Parse and validate QR payload
const parseQR = (qrData) => {
  try {
    const parsed = JSON.parse(qrData);

    if (!parsed.bookingId || !parsed.userId || !parsed.pumpId) {
      return { valid: false, message: 'Invalid QR payload' };
    }

    return { valid: true, data: parsed };
  } catch (error) {
    return { valid: false, message: 'Cannot parse QR data' };
  }
};

module.exports = { generateQR, parseQR };
