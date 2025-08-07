'use client';

import { useEffect, useState } from 'react';

export default function GreekPatternBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Greek Wave Patterns */}
      <svg 
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1200 800" 
        preserveAspectRatio="none"
        style={{ 
          zIndex: -1,
          transform: `translateY(${scrollY * 0.1}px)` 
        }}
      >
        {/* Main flowing wave - Greek meander inspired */}
        <path
          d="M0,100 Q300,50 400,100 T800,100 Q1000,130 1200,100"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3"
        />
        
        {/* Secondary wave pattern */}
        <path
          d="M0,180 Q200,150 300,180 T600,180 Q900,210 1200,180"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />
        
        {/* Greek key pattern elements */}
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none">
          {/* Repeating Greek key motifs */}
          <path d="M100,250 L140,250 L140,290 L180,290 L180,250 L220,250 L220,330 L100,330 Z" />
          <path d="M300,200 L340,200 L340,240 L380,240 L380,200 L420,200 L420,280 L300,280 Z" />
          <path d="M600,280 L640,280 L640,320 L680,320 L680,280 L720,280 L720,360 L600,360 Z" />
          <path d="M900,180 L940,180 L940,220 L980,220 L980,180 L1020,180 L1020,260 L900,260 Z" />
        </g>
      </svg>

      {/* Second layer with different scroll speed */}
      <svg 
        className="absolute top-0 right-0 w-full h-full"
        viewBox="0 0 1200 800" 
        preserveAspectRatio="none"
        style={{ 
          zIndex: -2,
          transform: `translateY(${scrollY * -0.05}px)` 
        }}
      >
        {/* Flowing lines inspired by Greek pottery */}
        <path
          d="M1200,300 Q900,250 800,300 T400,300 Q200,330 0,300"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="4"
        />
        
        <path
          d="M1200,400 Q1000,370 900,400 T600,400 Q300,430 0,400"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="2"
        />

        {/* Greek spiral elements */}
        <g stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none">
          <circle cx="200" cy="500" r="15" />
          <circle cx="200" cy="500" r="25" />
          <circle cx="500" cy="450" r="12" />
          <circle cx="500" cy="450" r="20" />
          <circle cx="800" cy="520" r="18" />
          <circle cx="800" cy="520" r="28" />
        </g>
      </svg>

      {/* Bottom decorative elements */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 800" 
        preserveAspectRatio="none"
        style={{ 
          zIndex: -1,
          transform: `translateY(${scrollY * 0.08}px)` 
        }}
      >
        {/* Bottom wave patterns */}
        <path
          d="M0,600 Q300,570 400,600 T800,600 Q1000,630 1200,600 L1200,800 L0,800 Z"
          fill="rgba(255,255,255,0.02)"
        />
        
        <path
          d="M0,680 Q400,650 800,680 T1200,680 L1200,800 L0,800 Z"
          fill="rgba(255,255,255,0.015)"
        />

        {/* Greek column-inspired vertical elements */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="2" fill="none">
          <line x1="150" y1="550" x2="150" y2="700" />
          <line x1="350" y1="570" x2="350" y2="720" />
          <line x1="550" y1="560" x2="550" y2="710" />
          <line x1="750" y1="580" x2="750" y2="730" />
          <line x1="950" y1="565" x2="950" y2="715" />
        </g>
      </svg>

      {/* Floating Greek ornaments */}
      <div 
        className="absolute inset-0"
        style={{ 
          transform: `translateY(${scrollY * -0.03}px)` 
        }}
      >
        {/* Greek cross patterns */}
        <div className="absolute top-32 left-1/4 w-4 h-4 opacity-10">
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path d="M8,2 L12,2 L12,8 L18,8 L18,12 L12,12 L12,18 L8,18 L8,12 L2,12 L2,8 L8,8 Z" fill="white" />
          </svg>
        </div>
        
        <div className="absolute top-64 right-1/3 w-6 h-6 opacity-8">
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path d="M8,2 L12,2 L12,8 L18,8 L18,12 L12,12 L12,18 L8,18 L8,12 L2,12 L2,8 L8,8 Z" fill="white" />
          </svg>
        </div>

        <div className="absolute bottom-48 left-1/3 w-5 h-5 opacity-6">
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path d="M8,2 L12,2 L12,8 L18,8 L18,12 L12,12 L12,18 L8,18 L8,12 L2,12 L2,8 L8,8 Z" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}