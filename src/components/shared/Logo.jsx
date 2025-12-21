import React from 'react';
import { Heart, Mountain } from 'lucide-react';

const Logo = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizes[size]}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full"></div>
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <Mountain className="w-3/5 h-3/5 text-amber-600" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-light tracking-tight text-stone-800">IMARA</span>
          <span className="text-xs text-stone-500">Stability before ambition</span>
        </div>
      )}
    </div>
  );
};

export default Logo;