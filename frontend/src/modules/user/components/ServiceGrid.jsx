import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings, normalizeAssetUrl } from '../../../shared/context/SettingsContext';
import toast from 'react-hot-toast';

const ServiceTile = ({ icon, label, description, path, accentClass, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center">
        <div className="flex h-[102px] w-[95%] animate-pulse flex-col items-center justify-center gap-1.5 rounded-[16px] border border-white/20 bg-white/65 px-1 py-1">
          <div className="h-[72px] w-[72px] rounded-[16px] bg-gray-200" />
          <div className="h-2 w-10 rounded-full bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1.5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (!path) return;
        const lowerLabel = String(label || '').toLowerCase();
        const state = {};
        if (lowerLabel.includes('without driver')) {
          state.rentalType = 'without_driver';
        } else if (lowerLabel.includes('with driver')) {
          state.rentalType = 'with_driver';
        } else if (lowerLabel.includes('outstation')) {
          state.isOutstation = true;
          state.deliveryScope = 'outstation';
        } else if (lowerLabel.includes('movers')) {
          state.category = 'movers';
        }
        navigate(path, { state });
      }}
      className="flex h-full w-full items-center justify-center transition-transform"
    >
      <div className="flex h-[102px] w-full flex-col items-center justify-center gap-1 px-1 py-0.5">
        <div className={`flex h-[72px] w-[72px] items-center justify-center rounded-[18px] overflow-hidden ${accentClass || 'bg-gray-50'}`}>
          <img 
            src={icon} 
            alt={label} 
            className="h-full w-full object-contain p-1 rounded-[14px] drop-shadow-sm transition-transform duration-300 hover:scale-105" 
            style={{ 
              mixBlendMode: 'multiply',
              filter: 'contrast(1.08) brightness(1.04)'
            }}
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <span className="min-h-[22px] text-[10px] font-bold leading-tight text-slate-800 line-clamp-2 uppercase tracking-wide">
            {label}
          </span>
          <span className="sr-only">{description}</span>
        </div>
      </div>
    </motion.button>
  );
};

const ServiceGrid = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getServiceKey = (service, index) => {
    const label = String(service?.label || '').trim();
    const path = String(service?.path || '').trim();
    return label || path ? `${label || 'service'}-${path || index}` : `service-${index}`;
  };

  const getPath = (module) => {
    const serviceType = String(module?.service_type || '').trim().toLowerCase();
    const transportType = String(module?.transport_type || '').trim().toLowerCase();
    const moduleName = String(module?.name || '').trim().toLowerCase();

    if (transportType === 'delivery') return '/taxi/user/parcel/type';
    if (serviceType === 'rental') return '/taxi/user/rental';
    if (serviceType === 'outstation') return '/taxi/user/intercity';
    if (serviceType === 'pooling' || moduleName.includes('pooling')) {
      return '/taxi/user/pooling';
    }

    if (serviceType === 'bus' || transportType === 'bus' || moduleName.includes('bus')) {
      return '/taxi/user/bus';
    }

    // Regular ride-hailing modules should always start from location selection.
    if (
      ['normal', 'taxi', 'ride', 'ride_hailing', 'ride-hailing'].includes(serviceType) ||
      ['taxi', 'both'].includes(transportType) ||
      moduleName.includes('taxi') ||
      moduleName.includes('cab')
    ) {
      return '/taxi/user/ride/select-location';
    }

    return '/taxi/user/ride/select-location';
  };

  const getAccent = (index) => {
    const accnets = [
      'bg-[linear-gradient(135deg,#FFF7ED_0%,#FFE5C2_100%)]', // Orange
      'bg-[linear-gradient(135deg,#FEFCE8_0%,#FDE68A_100%)]', // Yellow
      'bg-[linear-gradient(135deg,#EFF6FF_0%,#DBEAFE_100%)]', // Blue
      'bg-[linear-gradient(135deg,#F5F3FF_0%,#E9D5FF_100%)]', // Purple
      'bg-[linear-gradient(135deg,#ECFDF5_0%,#A7F3D0_100%)]', // Green
      'bg-[linear-gradient(135deg,#FFF1F2_0%,#FECDD3_100%)]', // Rose
    ];
    return accnets[index % accnets.length];
  };

  const { modules, loading: settingsLoading } = useSettings();

  useEffect(() => {
    console.log('[DEBUG] ServiceGrid modules received:', modules, 'settingsLoading:', settingsLoading);
    if (settingsLoading) return;
    
    const desiredOrder = [
      'delivery',
      'courier',
      'rental without driver',
      'rental with driver',
      'delivery outstation',
      'packers & movers'
    ];

    // Filter active modules to match desiredOrder names
    const matchedModules = (modules || []).filter(m => {
      const name = String(m.name || '').toLowerCase().trim();
      return m.active && desiredOrder.includes(name);
    });

    // Sort active modules based on desiredOrder
    matchedModules.sort((a, b) => {
      const nameA = String(a.name || '').toLowerCase().trim();
      const nameB = String(b.name || '').toLowerCase().trim();
      return desiredOrder.indexOf(nameA) - desiredOrder.indexOf(nameB);
    });

    const mapped = matchedModules.map((m, idx) => ({
      icon: normalizeAssetUrl(m.mobile_menu_icon),
      label: m.name,
      description: m.short_description,
      path: getPath(m),
      accentClass: getAccent(idx)
    }));
    
    setServices(mapped);
    setLoading(false);
  }, [modules, settingsLoading]);

  return (
    <div className="px-5">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="py-1"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Services</p>
            <h2 className="mt-1 text-[18px] font-semibold text-slate-900">Choose your ride</h2>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">Tap to start quickly.</p>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => <ServiceTile key={i} loading />)}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {services.slice(0, 6).map((service, index) => (
                <ServiceTile key={getServiceKey(service, index)} {...service} />
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default ServiceGrid;
