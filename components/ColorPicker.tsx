import React, { useState, useEffect } from 'react';

const PRESET_COLORS = [
  '#86A8E7', '#91EAE4', '#F7CAC9', '#F7797D', 
  '#C471ED', '#F64F59', '#12D8FA', '#a1c4fd'
];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  const [customColor, setCustomColor] = useState(selectedColor);

  useEffect(() => {
    setCustomColor(selectedColor);
  }, [selectedColor]);

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      onColorChange(newColor);
    }
  };
  
  const handleCustomColorBlur = () => {
    if (!(/^#([0-9A-F]{3}){1,2}$/i.test(customColor))) {
        setCustomColor(selectedColor);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Color</label>
      <div className="flex flex-wrap gap-3 items-center">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            type="button"
            className={`w-10 h-10 rounded-full transition-transform transform hover:scale-110 shadow-md border-2 ${selectedColor === color ? 'ring-2 ring-offset-2' : 'border-transparent'}`}
            style={{ 
              backgroundColor: color, 
              borderColor: selectedColor === color ? 'white' : 'transparent', 
              ringColor: selectedColor,
              '--tw-ring-offset-color': '#ffffff40'
            } as React.CSSProperties}
            onClick={() => {
              onColorChange(color);
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
      <div className="relative mt-4">
        <span 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white/50 shadow-sm pointer-events-none" 
          style={{ 
            backgroundColor: /^#([0-9A-F]{3}){1,2}$/i.test(customColor) ? customColor : 'transparent' 
          }} 
        />
        <input
          type="text"
          value={customColor}
          onChange={handleCustomColorChange}
          onBlur={handleCustomColorBlur}
          className="w-full pl-14 pr-4 py-3 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition duration-300 shadow-sm text-gray-800 placeholder-gray-500"
          placeholder="Enter hex color, e.g., #86A8E7"
          style={{ '--tw-ring-color': selectedColor } as React.CSSProperties}
        />
      </div>
    </div>
  );
};