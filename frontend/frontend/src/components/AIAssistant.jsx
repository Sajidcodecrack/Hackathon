import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your SmartFuel AI. How can I optimize your route or fuel quota today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and replying based on keywords
    setTimeout(() => {
      let reply = "I've analyzed the real-time data. Traffic at your usual station is heavy. Consider going to Metro Fuel instead to save 12 minutes.";
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('quota')) {
        reply = "Based on your weekly driving patterns, your remaining 35L quota is perfectly on track to last until the end of the month! Great eco-driving.";
      } else if (lowerInput.includes('cheapest') || lowerInput.includes('price')) {
        reply = "Fuel prices are standard globally, but I recommend Metro Station on 4th Ave—they currently have zero wait time, saving you fuel from idling!";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        reply = "Hi there! Just let me know if you want me to matrix-scan nearby pumps or project your monthly expenses.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-[100] w-14 h-14 bg-gradient-to-r from-indigo-500 to-primary-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] border-2 border-white/20 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.8)]"
      >
        <Sparkles size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 lg:bottom-28 lg:right-10 z-[100] w-[350px] h-[500px] glass-card flex flex-col overflow-hidden max-w-[calc(100vw-3rem)] shadow-2xl border-indigo-500/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-primary-500 p-4 flex justify-between items-center text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
               <div className="flex items-center gap-2 relative z-10">
                 <Bot size={22} />
                 <div>
                   <h3 className="font-bold text-sm">SmartFuel Assistant</h3>
                   <p className="text-[10px] text-indigo-100 uppercase tracking-wider font-semibold">Gemini AI Model Active</p>
                 </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors relative z-10">
                 <X size={18} />
               </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary-500 text-white rounded-br-sm' : 'glass-panel border border-slate-100 text-slate-700 rounded-bl-sm'}`}>
                     {msg.content}
                   </div>
                 </div>
               ))}
               
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="glass-panel border border-slate-100 p-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                       <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                       <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-primary-400 rounded-full" />
                       <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                    </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
               <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask Gemini to optimize..." 
                 className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
               />
               <button 
                 type="submit" 
                 disabled={!input.trim()}
                 className="bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50"
               >
                 <Send size={18} />
               </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
