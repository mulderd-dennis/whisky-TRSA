
import React from 'react';
import { Whisky } from '../types';
import { BOTTLE_UNIT_CL, CL_STEP } from '../constants';

interface WhiskySliderProps {
  whisky: Whisky;
  valueCl: number;
  onChange: (newCl: number) => void;
  maxCl?: number;
}

const WhiskySlider: React.FC<WhiskySliderProps> = ({ whisky, valueCl, onChange, maxCl = 210 }) => {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-lg border border-gray-800 mb-4 transition-all hover:border-[#D4AF37]/50 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{whisky.name}</h3>
          <p className="text-gray-500 text-xs italic">{whisky.distillery} • {whisky.region}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-serif text-[#D4AF37]">{valueCl}</span>
          <span className="text-xs text-gray-400 ml-1">cl</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={maxCl}
        step={CL_STEP}
        value={valueCl}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
      />
      
      <div className="flex justify-between mt-2 text-[10px] text-gray-600 uppercase tracking-tighter">
        <span>Leeg (0)</span>
        <span>1 Fles ({BOTTLE_UNIT_CL}cl)</span>
        <span>2 Flessen ({BOTTLE_UNIT_CL * 2}cl)</span>
        <span>3 Flessen ({BOTTLE_UNIT_CL * 3}cl)</span>
      </div>
    </div>
  );
};

export default WhiskySlider;
