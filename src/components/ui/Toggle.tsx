'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      className="sr-only peer" 
      checked={checked} 
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
    />
    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF7F3F]"></div>
  </label>
);

interface ToggleFieldProps {
  label: string;
  value: string;
  isVisible: boolean;
  onValueChange: (value: string) => void;
  onToggle: (visible: boolean) => void;
  placeholder?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({ 
  label, value, isVisible, onValueChange, onToggle, placeholder 
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
      <Toggle checked={isVisible} onChange={onToggle} />
    </div>
    {isVisible && (
      <input 
        type="text"
        value={value}
        onChange={e => onValueChange(e.target.value)}
        className="modern-input"
        placeholder={placeholder}
      />
    )}
  </div>
);
