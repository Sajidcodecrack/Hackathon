import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, Zap, Shield, BarChart3, Users, Fuel, Smartphone, User, Scan, LayoutDashboard, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  // CONFIGURATION OPTIONS FOR USER
  const videoUrl = "https://pixabay.com/videos/road-fuel-station-petrol-pump-159710/?fbclid=IwY2xjawRFuKlleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEedptjYKCi7gbcCgJojJ4wrc1-BrQ1eUwOnp_fjlUR7KsspQDxgszwLhcBZxA_aem_M6HFPD8i4zIdrrRU5Ag5SA"; // Placeholder - User can change this
  const heroImageUrl = "https://images.unsplash.com/photo-1635648551082-163db1e12530?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&fbclid=IwY2xjawRFt9hleHRuA2FlbQIxMQBzcnRjBmFwcF9pZAEwAAEeX-m6xY1-Q-HCSHIvhtXQ1fPgZrWOLrWOGnued-cgfMJQXACnZCpj5sPQasc_aem_vTaW7qYz6Xt2G88bfSXzlw";

  return (
    <div className="relative bg-white overflow-hidden -mt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-white to-white" />
           <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-primary-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
           <motion.div 
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="space-y-8"
           >
              <span className="bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary-200">The Future of Fuel v2.0</span>
              <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                Smart Fueling <br/>
                <span className="text-primary-600">Redefined.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed">
                Eliminate queues, automate quotas, and optimize your fueling experience with Gemini AI-powered recommendations.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                 <Link to="/register" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl hover:-translate-y-1">
                    Get Started Free <ChevronRight size={20} />
                 </Link>
                 <a href="#demo" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-md">
                    Watch Demo <Play size={20} className="fill-slate-700" />
                 </a>
              </div>

              <div className="flex items-center gap-6 pt-10 border-t border-slate-100 italic text-slate-400 font-medium">
                 <div>Trusted by 5,000+ drivers</div>
                 <div className="w-1 h-1 bg-slate-300 rounded-full" />
                 <div>Partnered with 200 Stations</div>
              </div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative"
           >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-8 border-white">
                 <img src={heroImageUrl} alt="NextGen Fueling" className="w-full aspect-[4/5] object-cover" />
                 <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">AI Integrated System</p>
                    <h3 className="text-2xl font-black italic">"Predicting city traffic to save you hours of waiting."</h3>
                 </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-2xl -z-10 rotate-12 opacity-20" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500 rounded-full -z-10 opacity-20" />
           </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Everything you need for a <br/> seamless fuel experience.</h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { title: "AI Predictions", desc: "Real-time traffic and queue analysis to recommend the fastest station.", icon: Zap, color: "bg-primary-50 text-primary-600" },
             { title: "Security First", desc: "QR-code based encrypted verification for every single transaction.", icon: Shield, color: "bg-indigo-50 text-indigo-600" },
             { title: "Quota Management", desc: "Automatic monthly fuel allocation based on BRTA vehicle classification.", icon: BarChart3, color: "bg-amber-50 text-amber-600" }
           ].map((feat, i) => (
             <motion.div 
               key={i} 
               whileHover={{ y: -10 }} 
               className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4"
             >
                <div className={`${feat.color} p-5 rounded-3xl`}>
                   <feat.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{feat.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Smart Ecosystem Showcase Section */}
      <section id="demo" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Device Mockup */}
              <div className="lg:w-1/2 relative group">
                 <div className="absolute -inset-4 bg-primary-500/20 rounded-[60px] blur-2xl group-hover:bg-primary-500/30 transition-all" />
                 
                 <div className="relative bg-slate-900 w-[300px] sm:w-[350px] mx-auto rounded-[60px] border-[12px] border-slate-800 shadow-[0_50px_100px_rgba(0,0,0,0.3)] aspect-[9/19] overflow-hidden">
                    {/* App Interface Simulation */}
                    <div className="h-full flex flex-col pt-12 p-6 space-y-6">
                       <div className="flex justify-between items-center text-white/50 text-[10px] font-bold uppercase tracking-widest">
                          <span>SmartFuel v2.0</span>
                          <span>17:00 • 80%</span>
                       </div>
                       
                       <div className="bg-white/10 p-5 rounded-3xl border border-white/10 space-y-4">
                          <p className="text-white text-xs font-bold items-center flex gap-2"><Fuel size={14} className="text-primary-400" /> Active Quota</p>
                          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 2 }} className="h-full bg-primary-500" />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-white/40">
                             <span>65L Remaining</span>
                             <span>Octane</span>
                          </div>
                       </div>

                       <div className="bg-white p-6 rounded-3xl flex flex-col items-center gap-4 shadow-xl">
                          <div className="w-full aspect-square bg-slate-50 rounded-2xl flex items-center justify-center relative overflow-hidden">
                             <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SMARTFUEL_DEMO" alt="QR" className="w-32 h-32 opacity-80" />
                             <motion.div 
                                animate={{ y: [0, 150, 0] }} 
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 w-full h-1 bg-primary-500 shadow-[0_0_15px_#14b8a6]" 
                             />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scan at Pump 04</p>
                       </div>

                       <div className="mt-auto flex justify-around p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400"><LayoutDashboard size={14} /></div>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30"><MapPin size={14} /></div>
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30"><User size={14} /></div>
                       </div>
                    </div>
                 </div>

                 {/* Floating Badges */}
                 <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-6 -right-10 glass-panel bg-white p-4 shadow-xl border-slate-100 flex items-center gap-3">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg"><Zap size={20} /></div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase">AI Recommendation</p>
                       <p className="text-sm font-bold text-slate-800 italic">"Go to Delta Station"</p>
                    </div>
                 </motion.div>
              </div>

              {/* Text Content */}
              <div className="lg:w-1/2 space-y-8">
                 <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">Your fueling journey, <br/> completely automated.</h2>
                 <p className="text-xl text-slate-500 leading-relaxed font-medium">
                    Our intelligent ecosystem syncs your vehicle registration with real-time station data. No physical cards, no cash hassles, and no waiting in the wrong lines.
                 </p>
                 
                 <div className="grid grid-cols-1 gap-6">
                    <div className="flex gap-4 items-start">
                       <div className="bg-slate-900 text-white p-3 rounded-2xl"><Smartphone size={24}/></div>
                       <div>
                          <h4 className="font-bold text-slate-800">Mobile First Management</h4>
                          <p className="text-slate-500 text-sm font-medium">Manage multiple vehicles, check remaining quotas, and find pumps from a single app.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 items-start">
                       <div className="bg-primary-500 text-white p-3 rounded-2xl"><Scan size={24}/></div>
                       <div>
                          <h4 className="font-bold text-slate-800">Touchless QR Check-ins</h4>
                          <p className="text-slate-500 text-sm font-medium">Just show your dynamically generated QR code to the station operator and fuel up.</p>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12 text-center">
              <div>
                 <p className="text-3xl font-black text-slate-900 leading-none">0s</p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Wait Time</p>
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900 leading-none">100%</p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Digital</p>
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900 leading-none">24/7</p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">AI Support</p>
              </div>
              <div>
                 <p className="text-3xl font-black text-slate-900 leading-none">0.2s</p>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">QR Latency</p>
              </div>
           </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-primary-600 relative">
         <div className="max-w-5xl mx-auto px-6 text-center space-y-8 text-white">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter italic">Join the Fueling Revolution Today.</h2>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="bg-white text-primary-600 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
                Create Account
              </Link>
            </div>
            <div className="flex justify-center gap-8 pt-12 items-center opacity-60">
               <Users size={20} />
               <Fuel size={20} />
               <Smartphone size={20} />
            </div>
         </div>
      </section>
    </div>
  );
};

export default Landing;
