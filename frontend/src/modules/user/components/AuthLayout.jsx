import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '@/assets/landing/hero.png';
import { useSettings } from '../../../shared/context/SettingsContext';

import mobilityBanner from '@/assets/images/mobility-banner-cartoony.png';

const AuthLayout = ({ children, title, subtitle }) => {
  const { settings } = useSettings();
  const appName = settings.general?.app_name || 'Ninja Truck';
  const appLogo = settings.general?.logo || settings.customization?.logo || settings.general?.favicon || '';

  return (
    <div className="min-h-[100dvh] w-full bg-[#F8F9FB] flex flex-col font-display selection:bg-black selection:text-white overflow-x-hidden">

      {/* Right side (Mobile-first login card) */}
      <div className="flex-1 min-h-[100dvh] lg:h-full flex flex-col items-center justify-start lg:justify-center px-4 py-6 sm:px-6 sm:py-8 relative w-full bg-white lg:bg-[#F8F9FB] overflow-x-hidden overflow-y-auto">
        {/* Subtle Background Banner */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.08] pointer-events-none overflow-hidden">
          <motion.img 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            src={mobilityBanner} 
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>

        {/* Vibrant Multi-color Background Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-300/30 to-orange-500/30 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-magenta-600/20 rounded-full blur-[100px] -z-10"></div>

        {/* Header (Visible on all screens now) */}
        <div className="w-full flex flex-col items-center text-center mb-6 mt-6 lg:mt-12 z-20 shrink-0">
            {appLogo ? (
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={appLogo}
                alt={`${appName} logo`}
                className="h-16 w-16 rounded-2xl object-cover bg-white p-1.5 mb-4 shadow-2xl shadow-black/10 border border-gray-50"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-magenta-500 rounded-2xl flex items-center justify-center mb-3 shadow-xl">
                <div className="w-7 h-7 bg-white rounded-lg"></div>
              </div>
            )}
            <h2 className="text-2xl font-black tracking-tighter text-black uppercase mb-1">{appName}</h2>
            <div className="w-8 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-[28px] sm:rounded-[40px] p-5 sm:p-8 md:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.06)] sm:shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-gray-100/70 z-10 relative"
        >
          {title && (
            <div className="mb-6 sm:mb-8 text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tighter uppercase mb-3 sm:mb-4">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-[280px] mx-auto">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <div className="relative z-10">
            {children}
          </div>
        </motion.div>
        
        {/* Helper footer link */}
        <div className="mt-6 sm:mt-8 text-center w-full max-w-md z-20 shrink-0">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Need assistance? <a href="/support" className="text-black hover:text-orange-500 transition-colors ml-1">Contact Support</a>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
