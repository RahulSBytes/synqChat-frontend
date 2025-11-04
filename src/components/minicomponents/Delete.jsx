import React from 'react';

function Delete() {
   const colors = [
    // Blacks → Grays → Whites
    '#000000', '#18181b', '#1a1a1a', '#212121', '#222',
    '#242424', '#27272a', '#272727', '#2a2a2a', '#2d2d2d',
    '#313131', '#323232', '#343434', '#353535', '#374151', '#3B3B3B',
    '#404040', '#414141', '#424242', '#444', '#484848', '#4a4a4a',
    '#4b4b4b', '#4b5563', '#505050', '#515151', '#52525b',
    '#606060', '#666', '#6b7280', '#71717a', '#717171',
    '#909090', '#919191', '#9ca3af', '#a1a1aa',
    '#c1c1c1', '#d1d5db', '#d4d4d8',
    '#e4e4e7', '#e5e7eb', '#f4f4f5', '#fafafa', '#ffffff',
    
    // Greens (dark to light)
    '#1e7a52', '#1f744e', '#248f60', '#5dbb63', '#689969', '#6ad2a5',
    
    // Blues
    '#2563eb',
    
    // Reds (dark to light)
    '#dc2626', '#dc262619', '#dc262633', '#ef4444', '#f87171', '#fca5a5',
  ];

  return (
    <div className="flex gap-2 flex-col p-4 bg-[#e1e1e1]">
      {colors.map((color, index) => (
        <div key={index} className="flex items-center">
          {/* Use inline style instead of Tailwind class */}
          <div
            style={{ backgroundColor: color }}
            className="h-40 w-40 mr-3 border border-black"
          ></div>
          <span className="text-black font-mono font-bold">{color}</span>
        </div>
      ))}
    </div>
  );
}

export default Delete;