import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Phone, Mail, LogIn, Menu, X, ArrowRight, CheckCircle2,
  Box, Truck, Package, FastForward, Clock, ShieldCheck, Moon, Sun
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../../../shared/context/SettingsContext';

import newHeroImg from '@/assets/ninja_truck_hero_fixed.png';
import checkUsOutImg from '@/assets/premium_grid_map.png';

// Reusable animation variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPageDark({ toggleTheme }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const appName = settings.general?.app_name || 'Ninja Truck';
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const appLinks = [
    { label: 'User Login', href: '/login' },
    { label: 'Driver Login', href: '/taxi/driver/login' },
  ];

  const handleRedirect = (path, tabName) => (e) => {
    e?.preventDefault();
    if (tabName) setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  const navLinks = [
    { name: 'HOME', path: '#home', tab: 'home' },
    { name: 'COMPANY', path: '/about', tab: 'about' },
    { name: 'LOGISTICS', path: '/services', tab: 'services' },
    { name: 'FAQS', path: '/faq', tab: 'faq' },
    { name: 'CONTACT', path: '/contact', tab: 'contact' },
  ];

  const mainServices = [
    { id: 'courier', icon: <Package size={56} className="text-[#111111] mb-4" />, title: 'COURIER', desc: 'Secure parcel delivery for personal packages or e-commerce businesses.' },
    { id: 'vehicle-rental', icon: <Clock size={56} className="text-[#111111] mb-4" />, title: 'VEHICLE RENTAL', desc: 'Rent a truck by the hour with a dedicated driver for multiple stops.' },
    { id: 'packers', icon: <Box size={56} className="text-[#111111] mb-4" />, title: 'PACKERS & MOVERS', desc: 'Complete relocation services for home and office shifting.' },
  ];

  const otherServices = [
    { id: 'mini-trucks', icon: <Truck size={40} className="text-[#F9C105]" />, title: 'MINI TRUCKS', desc: 'Quick intracity deliveries & small cargo.' },
    { id: 'heavy-vehicles', icon: <Truck size={40} className="text-[#F9C105]" />, title: 'HEAVY VEHICLES', desc: 'Large capacity trucks for industrial goods.' },
    { id: 'intercity', icon: <FastForward size={40} className="text-[#F9C105]" />, title: 'INTERCITY', desc: 'Outstation logistics across cities.' },
    { id: 'insurance', icon: <ShieldCheck size={40} className="text-[#F9C105]" />, title: 'GOODS INSURANCE', desc: 'Comprehensive coverage for cargo.' },
  ];

  const benefits = [
    { id: 'doorstep', title: 'DOORSTEP PICKUP', desc: 'We pick up directly from your warehouse.' },
    { id: 'tracking', title: 'LIVE TRACKING', desc: 'Monitor your goods in real-time via GPS.' },
    { id: 'fast', title: 'FAST BOOKING', desc: 'Book a truck in under 60 seconds.' },
    { id: 'secure', title: 'SECURE TRANSIT', desc: 'Verified drivers and insured goods.' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-['Outfit',sans-serif] text-slate-300 overflow-x-hidden selection:bg-[#F9C105] selection:text-[#111111]">
      
      {/* Top Bar */}
      <div className="hidden lg:flex justify-between items-center px-8 lg:px-16 py-3 bg-[#F9C105] text-[#111111] font-bold text-sm tracking-widest border-b-[4px] border-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <span>ALL OVER INDIA LOGISTICS</span>
        </div>
        <div className="flex gap-8">
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Phone size={16} />
            <span>CALL US 8942852470</span>
          </div>
          <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <Mail size={16} />
            <span>SUPPORT@NINJATRUCK.IN</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-lg border-b-2 border-slate-800 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between h-24">
          <Link to="/" className="font-black text-3xl tracking-tighter text-white flex items-center gap-2">
            <span className="text-[#F9C105] drop-shadow-md">NINJA TRUCK</span>
            <span className="hidden sm:inline font-bold tracking-widest text-slate-500 text-lg">LOGISTICS</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-10 font-bold text-slate-400 tracking-wider text-sm">
            {navLinks.map((link) => (
              <a 
                key={link.tab} 
                href={link.path} 
                onClick={handleRedirect(link.path, link.tab)}
                className={`hover:text-[#F9C105] transition-colors ${activeTab === link.tab ? 'text-[#F9C105]' : ''}`}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Switch to Light Mode">
              <Sun size={20} className="text-[#F9C105]" />
            </button>
            <button onClick={() => navigate('/login')} className="font-bold text-slate-300 hover:text-white px-4 py-2 transition-colors">
              LOGIN
            </button>
            <button onClick={() => navigate('/login')} className="bg-[#F9C105] text-[#111111] hover:bg-[#e6b204] px-8 py-3 font-black tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
              BOOK TRUCK
            </button>
          </div>
          <button className="lg:hidden p-2 -mr-2 text-[#F9C105]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-24 left-0 w-full bg-[#111111] border-b-4 border-[#F9C105] shadow-2xl flex flex-col px-6 py-6 gap-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.tab} 
                href={link.path} 
                onClick={handleRedirect(link.path, link.tab)}
                className={`font-black text-xl tracking-widest py-3 border-b border-slate-800 ${activeTab === link.tab ? 'text-[#F9C105]' : 'text-slate-300'}`}
              >
                {link.name}
              </a>
            ))}
            <button onClick={toggleTheme} className="flex items-center gap-3 font-black text-xl tracking-widest py-3 border-b border-slate-800 text-slate-300">
              <Sun size={24} />
              <span>Light Mode</span>
            </button>
            <button onClick={() => navigate('/login')} className="mt-6 bg-[#F9C105] text-[#111111] w-full py-5 font-black text-xl tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
              BOOK A TRUCK NOW
            </button>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-12 pb-24 lg:pt-24 lg:pb-32 px-6 lg:px-16 overflow-hidden max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          
          {/* Hero Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start gap-8 lg:pr-12"
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-3 px-5 py-2 bg-[#1a1a1a] border-l-4 border-[#F9C105] text-white font-bold tracking-widest text-sm uppercase">
              <span>All Over India</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[1.05] uppercase">
              No Highway Is <span className="text-[#F9C105]">Too Long.</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-lg lg:text-xl text-slate-400 font-medium leading-relaxed max-w-lg border-l-2 border-slate-800 pl-4">
              Everything your business needs to move goods efficiently. Fast, secure, and affordable transportation for all commercial loads.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mt-4">
              <button onClick={() => navigate('/login')} className="group flex items-center justify-center gap-3 bg-[#F9C105] text-[#111111] hover:bg-[#e6b204] px-10 py-5 font-black text-xl tracking-widest uppercase shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] transition-all hover:translate-x-1 hover:-translate-y-1 w-full sm:w-auto">
                <span>Book Ride</span>
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Image - Aggressive Slanted Stack */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative w-full max-w-[700px] mx-auto lg:mx-0 flex justify-center lg:justify-end py-10"
          >
            {/* Glowing orb */}
            <div className="absolute inset-0 bg-[#F9C105] opacity-20 blur-[100px] rounded-full scale-75"></div>
            
            {/* The Stack Container (Tilt) */}
            <div className="relative rotate-3 hover:rotate-0 transition-transform duration-700 ease-out group w-full max-w-[550px]">
              
              {/* Offset Yellow Border (The Stack) */}
              <div 
                className="absolute top-6 -left-6 w-full h-full bg-[#F9C105] opacity-90 group-hover:top-4 group-hover:-left-4 transition-all duration-700 ease-out"
                style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)' }}
              ></div>
              
              {/* Image Container with Slanted Cut */}
              <div 
                className="relative z-10 w-full bg-[#ffffff] overflow-hidden shadow-2xl shadow-black/50"
                style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)', aspectRatio: '4/3' }}
              >
                <img 
                  src={newHeroImg} 
                  alt="Ninja Truck" 
                  className="w-full h-full object-cover scale-110 group-hover:scale-105 transition-transform duration-700 ease-out origin-center" 
                />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Services Billboard Section */}
      <section id="services" className="py-24 px-6 lg:px-16 bg-[#111111] relative border-t-2 border-slate-900">
        <div className="max-w-7xl mx-auto">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-[#F9C105] font-black tracking-widest text-lg uppercase mb-4">- OUR EXPERTISE -</h2>
            <h3 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase">Logistics Solutions</h3>
          </motion.div>

          {/* Billboard Style Main Services Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {mainServices.map((svc) => (
              <motion.div variants={fadeUpVariant} key={svc.id} className="group bg-[#F9C105] rounded-3xl p-10 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] cursor-pointer">
                <div className="bg-white/20 p-6 rounded-2xl mb-6 backdrop-blur-sm">
                   {svc.icon}
                </div>
                <h4 className="text-3xl font-black text-[#111111] tracking-tighter uppercase mb-4">{svc.title}</h4>
                <p className="text-[#111111] font-bold text-lg leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Secondary Services Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-16 border-t border-slate-800"
          >
            {otherServices.map((svc) => (
              <motion.div variants={fadeUpVariant} key={svc.id} className="bg-[#0a0a0a] border border-slate-800 rounded-2xl p-8 hover:border-[#F9C105] transition-colors duration-300 cursor-pointer">
                {svc.icon}
                <h4 className="text-xl font-black text-white tracking-wide uppercase mt-6 mb-3">{svc.title}</h4>
                <p className="text-slate-400 font-medium">{svc.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 lg:px-16 bg-[#0a0a0a] border-t-2 border-slate-900 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUpVariant} className="text-[#F9C105] font-black tracking-widest text-lg uppercase mb-4">- WHY CHOOSE US -</motion.h2>
            <motion.h3 variants={fadeUpVariant} className="text-4xl lg:text-6xl font-black tracking-tighter text-white uppercase mb-8">The Smartest Way To Move Goods</motion.h3>
            <motion.p variants={fadeUpVariant} className="text-xl text-slate-400 font-medium mb-16 max-w-lg">
              We combine cutting-edge technology with a vast network of professional drivers to deliver an unmatched logistics experience.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {benefits.map((ben) => (
                <motion.div variants={fadeUpVariant} key={ben.id} className="flex gap-4">
                  <CheckCircle2 size={28} className="text-[#F9C105] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-wide mb-2">{ben.title}</h4>
                    <p className="text-slate-400 font-medium">{ben.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden shadow-2xl border-4 border-[#111111] bg-[#111111]">
              <img src={checkUsOutImg} alt="Logistics Operations" className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105" />
            </div>
            
            {/* Floating Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-10 -left-10 bg-[#F9C105] text-[#111111] p-10 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)] max-w-[320px] hidden md:block"
            >
              <div className="text-5xl font-black tracking-tighter mb-2">99.8%</div>
              <div className="font-black text-xl uppercase tracking-widest">On-Time Delivery</div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Check Us Out / Community Section */}
      <section className="py-24 px-6 lg:px-16 bg-[#111111] border-y-2 border-slate-900">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto text-center"
        >
          <motion.h2 variants={fadeUpVariant} className="text-[#F9C105] font-black tracking-widest text-lg uppercase mb-4">- JOIN THE NETWORK -</motion.h2>
          <motion.h3 variants={fadeUpVariant} className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-16">Get Started Today</motion.h3>
          
          <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {appLinks.map((link, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(link.href)}
                className={`flex items-center justify-center gap-4 px-10 py-6 font-black text-xl tracking-widest uppercase shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] transition-all hover:-translate-y-1 w-full sm:w-auto min-w-[300px] ${
                  idx === 0 
                    ? 'bg-[#F9C105] text-[#111111] hover:bg-[#e6b204]' 
                    : 'bg-[#1a1a1a] text-white border-2 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0a0a0a] pt-24 pb-12 px-6 lg:px-16 text-slate-400">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 mb-20"
        >
          <motion.div variants={fadeUpVariant} className="lg:col-span-2 pr-0 lg:pr-16">
            <Link to="/" className="font-black text-4xl tracking-tighter text-white flex items-center gap-2 mb-8">
              <span className="text-[#F9C105]">NINJA TRUCK</span>
            </Link>
            <p className="font-medium leading-relaxed mb-8 text-lg">
              We provide the best logistics and truck rental services in the region. Reliable, fast, and secure deliveries at your fingertips.
            </p>
            <div className="font-black tracking-widest text-[#F9C105] text-xl">WWW.NINJATRUCK.IN</div>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="font-black text-white text-xl uppercase tracking-widest mb-8">Quick Links</h4>
            <ul className="flex flex-col gap-5 font-bold tracking-wide">
              <li><Link to="/terms" className="hover:text-[#F9C105] transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#F9C105] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="hover:text-[#F9C105] transition-colors">Refund Policy</Link></li>
              <li><Link to="/contact" className="hover:text-[#F9C105] transition-colors">Contact Us</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="font-black text-white text-xl uppercase tracking-widest mb-8">Services</h4>
            <ul className="flex flex-col gap-5 font-bold tracking-wide">
              <li><Link to="/services" className="hover:text-[#F9C105] transition-colors">Mini Trucks</Link></li>
              <li><Link to="/services" className="hover:text-[#F9C105] transition-colors">Heavy Vehicles</Link></li>
              <li><Link to="/services" className="hover:text-[#F9C105] transition-colors">Intercity</Link></li>
              <li><Link to="/services" className="hover:text-[#F9C105] transition-colors">Packers & Movers</Link></li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 font-bold tracking-wider text-sm">
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">PRIVACY POLICY</Link>
            <Link to="/terms" className="hover:text-white transition-colors">TERMS & CONDITIONS</Link>
          </div>
          <div>
            COPYRIGHT 2026 ┬⌐ NINJA TRUCK LOGISTICS.
          </div>
        </div>
      </footer>
      
    </div>
  );
}
