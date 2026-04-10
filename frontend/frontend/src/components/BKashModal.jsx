import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BKashModal = ({ isOpen, onClose, onPaymentSuccess, amount }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('017XXXXXXXX');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setLoading(true);
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 1500);Bro 
    } else {
      setLoading(true);
      setTimeout(() => {
        setStep(3);
        setLoading(false);
        setTimeout(() => {
           onPaymentSuccess();
        }, 2000);
      }, 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#D12053] w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-white/10">
               <img src="https://www.logo.wine/a/logo/BKash/BKash-bKash-Logo.wine.svg" alt="bKash" className="h-8 invert brightness-0" />
               <button onClick={onClose} className="text-white hover:bg-white/10 p-1 rounded-full"><X size={20}/></button>
            </div>

            <div className="p-6 bg-white mx-2 my-2 rounded-xl">
               {step === 1 && (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center mb-6">
                       <p className="text-[#D12053] font-bold text-lg">Pre-authorize bKash Payment</p>
                       <p className="text-slate-500 text-sm">Amount to pre-pay: ৳{amount || '1,500'}</p>
                    </div>
                    <div>
                       <label className="text-xs font-bold text-slate-400 uppercase">Your bKash Number</label>
                       <div className="flex items-center gap-2 border-b-2 border-[#D12053] py-2 mt-1">
                          <Smartphone size={20} className="text-[#D12053]" />
                          <input 
                            type="text" 
                            className="flex-1 outline-none font-bold text-lg" 
                            value={phone} 
                            onChange={e => setPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                          />
                       </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-[#D12053] text-white py-3 rounded-lg font-bold shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider mt-4"
                    >
                      {loading ? 'Processing...' : 'Proceed'}
                    </button>
                    <p className="text-[10px] text-center text-slate-400 italic">By clicking proceed, you agree to the Terms & Conditions of bKash.</p>
                 </form>
               )}

               {step === 2 && (
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-center mb-6">
                       <p className="text-[#D12053] font-bold text-lg">Enter Your PIN</p>
                       <p className="text-slate-500 text-sm">Authorized for SmartFuel System</p>
                    </div>
                    <div className="flex justify-center">
                       <input 
                         type="password" 
                         className="w-32 border-b-2 border-[#D12053] outline-none text-center text-2xl tracking-[1em] font-bold" 
                         maxLength={5}
                         autoFocus
                         value={pin}
                         onChange={e => setPin(e.target.value)}
                       />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading || pin.length < 5}
                      className="w-full bg-[#D12053] text-white py-3 rounded-lg font-bold shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider mt-6 disabled:opacity-50"
                    >
                      {loading ? 'Authenticating...' : 'Confirm Payment'}
                    </button>
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                       <ShieldCheck size={14} />
                       <span className="text-[10px] font-medium">Secure End-to-End Encryption</span>
                    </div>
                 </form>
               )}

               {step === 3 && (
                 <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center space-y-4">
                    <div className="flex justify-center flex-col items-center gap-4">
                       <CheckCircle2 size={60} className="text-green-500" />
                       <div>
                          <p className="font-bold text-xl text-slate-800">Payment Successful!</p>
                          <p className="text-slate-500">TrxID: BK{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                       <p className="text-xs font-semibold text-slate-400 uppercase">Slot Secured For</p>
                       <p className="font-bold text-slate-700">bKash User: {phone}</p>
                    </div>
                 </motion.div>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 flex flex-col items-center gap-2">
               <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center"><Smartphone size={16} className="text-[#D12053]" /></div>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#D12053] font-bold text-[10px]">24/7</div>
               </div>
               <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-80">bKash Customer Support 16247</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BKashModal;
