import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette, Zap, Sunrise, Droplets } from 'lucide-react';
import { storage } from '../../utils/storage';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('amber');

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Bright and clear' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { id: 'warm', name: 'Warm', icon: Sunrise, description: 'Cozy and calming' },
    { id: 'cool', name: 'Cool', icon: Droplets, description: 'Fresh and clean' }
  ];

  const accentColors = [
    { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
    { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-500' },
    { id: 'indigo', name: 'Indigo', color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    const savedTheme = storage.get('imara_theme') || 'light';
    const savedAccent = storage.get('imara_accent_color') || 'amber';
    setTheme(savedTheme);
    setAccentColor(savedAccent);
    applyTheme(savedTheme, savedAccent);
  }, []);

  const applyTheme = (themeName, accent) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light-theme', 'dark-theme', 'warm-theme', 'cool-theme');
    
    // Add current theme class
    root.classList.add(`${themeName}-theme`);
    
    // Set CSS variables for accent color
    const accentMap = {
      amber: { primary: '245, 158, 11', secondary: '217, 119, 6' },
      blue: { primary: '59, 130, 246', secondary: '37, 99, 235' },
      green: { primary: '34, 197, 94', secondary: '22, 163, 74' },
      purple: { primary: '168, 85, 247', secondary: '147, 51, 234' },
      pink: { primary: '236, 72, 153', secondary: '219, 39, 119' },
      indigo: { primary: '99, 102, 241', secondary: '79, 70, 229' }
    };
    
    const colors = accentMap[accent] || accentMap.amber;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
  };

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    storage.set('imara_theme', themeId);
    applyTheme(themeId, accentColor);
  };

  const handleAccentChange = (colorId) => {
    setAccentColor(colorId);
    storage.set('imara_accent_color', colorId);
    applyTheme(theme, colorId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-light text-stone-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-amber-600" />
          Theme & Appearance
        </h3>
        <span className="text-xs text-stone-500">
          Make IMARA feel like home
        </span>
      </div>

      {/* Theme Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-stone-700">Choose Theme</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <button
                key={themeOption.id}
                onClick={() => handleThemeChange(themeOption.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === themeOption.id
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-6 h-6 ${
                    theme === themeOption.id ? 'text-amber-600' : 'text-stone-400'
                  }`} />
                  <div className="text-center">
                    <p className={`text-sm font-medium ${
                      theme === themeOption.id ? 'text-amber-700' : 'text-stone-700'
                    }`}>
                      {themeOption.name}
                    </p>
                    <p className="text-xs text-stone-500">{themeOption.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-stone-700">Accent Color</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleAccentChange(color.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                accentColor === color.id
                  ? 'border-stone-300 ring-2 ring-offset-2 ring-amber-300'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${color.color}`}></div>
                <span className={`text-xs ${
                  accentColor === color.id ? 'text-amber-700 font-medium' : 'text-stone-600'
                }`}>
                  {color.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-stone-50 p-4 rounded-xl">
        <h4 className="text-sm font-medium text-stone-700 mb-3">Preview</h4>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-1/3 h-10 bg-primary rounded-lg"></div>
            <div className="w-2/3 h-10 bg-secondary rounded-lg"></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-6 bg-stone-200 rounded"></div>
            <div className="h-6 bg-stone-300 rounded"></div>
            <div className="h-6 bg-stone-400 rounded"></div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-stone-200">
            <p className="text-sm text-stone-700">This is how buttons and cards will look</p>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          handleThemeChange('light');
          handleAccentChange('amber');
        }}
        className="w-full py-2.5 border-2 border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-colors"
      >
        Reset to Default
      </button>
    </div>
  );
};

export default ThemeSwitcher;