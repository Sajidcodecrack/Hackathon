import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Fuel, MapPin, LayoutDashboard, LogOut, User as UserIcon, Calendar, Receipt, Scan, Car, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isLanding = location.pathname === '/';

  if (!user && !isLanding) return null; // Don't show regular navbar if not logged in

  if (!user && isLanding) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
           <div className="bg-primary-500 p-2 rounded-xl text-white">
              <Fuel size={24} strokeWidth={2.5} />
           </div>
           <span className="font-black text-2xl tracking-tighter text-slate-900">SmartFuel</span>
        </div>
        <div className="flex gap-4">
           <Link to="/login" className="text-slate-600 font-bold hover:text-slate-900 transition-all">Login</Link>
           <Link to="/register" className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-all shadow-lg">Sign Up</Link>
        </div>
      </nav>
    );
  }

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/find-pump', label: 'Find Pump', icon: MapPin },
    { path: '/vehicles', label: 'Garage', icon: Car },
    { path: '/bookings', label: 'Bookings', icon: Calendar },
    { path: '/transactions', label: 'Transactions', icon: Receipt },
    { path: '/operator', label: 'Scan QR', icon: Scan },
    { path: '/govt-analytics', label: 'Govt', icon: ShieldAlert },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-7xl mx-auto glass-panel px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary-500/10 p-2 rounded-xl text-primary-600">
            <Fuel size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Smart<span className="text-primary-500">Fuel</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2 pl-4">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {link.label}
                {isActive && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary-50 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <Link to="/profile" className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors px-3 py-1.5 rounded-lg border border-slate-100 cursor-pointer">
            <UserIcon size={16} className="text-primary-500" />
            {user?.name}
          </Link>
          
          <button 
            onClick={logout}
            className="p-2 sm:px-4 sm:py-2 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors border border-transparent hover:border-red-100 flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Visible only on small screens) */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 glass-panel flex justify-around p-2 z-50 bg-white/90">
        {navLinks.map((link) => {
           const isActive = location.pathname.includes(link.path);
           const Icon = link.icon;
           return (
             <Link
               key={link.path}
               to={link.path}
               className={`flex flex-col items-center gap-1 p-2 rounded-xl flex-1 ${
                 isActive ? 'text-primary-600' : 'text-slate-400'
               }`}
             >
               <Icon size={24} />
               <span className="text-[10px] font-semibold">{link.label}</span>
               {isActive && (
                 <motion.div 
                   layoutId="mobile-nav-indicator"
                   className="absolute inset-0 bg-primary-50 rounded-xl -z-10"
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
               )}
             </Link>
           );
        })}
      </div>
    </motion.nav>
  );
};

export default Navbar;
