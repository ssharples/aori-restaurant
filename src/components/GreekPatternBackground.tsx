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
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          zIndex: -1,
          transform: `translateY(${scrollY * 0.1}px)` 
        }}
      >
        {/* Main flowing wave - Greek meander inspired */}
        <path
          d="M0,100 Q300,50 400,100 T800,100 Q1000,130 1200,100"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="3"
        />
        
        {/* Secondary wave pattern */}
        <path
          d="M0,180 Q200,150 300,180 T600,180 Q900,210 1200,180"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
      </svg>

      {/* Second layer with different scroll speed */}
      <svg 
        className="absolute top-0 right-0 w-full h-full"
        viewBox="0 0 1200 800" 
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          zIndex: -2,
          transform: `translateY(${scrollY * -0.05}px)` 
        }}
      >
        {/* Flowing lines inspired by Greek pottery */}
        <path
          d="M1200,300 Q900,250 800,300 T400,300 Q200,330 0,300"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="4"
        />
        
        <path
          d="M1200,400 Q1000,370 900,400 T600,400 Q300,430 0,400"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="2"
        />
      </svg>

      {/* Bottom decorative elements */}
      <svg 
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 800" 
        preserveAspectRatio="xMidYMid slice"
        style={{ 
          zIndex: -1,
          transform: `translateY(${scrollY * 0.08}px)` 
        }}
      >
        {/* Bottom wave patterns */}
        <path
          d="M0,600 Q300,570 400,600 T800,600 Q1000,630 1200,600 L1200,800 L0,800 Z"
          fill="rgba(255,255,255,0.08)"
        />
        
        <path
          d="M0,680 Q400,650 800,680 T1200,680 L1200,800 L0,800 Z"
          fill="rgba(255,255,255,0.06)"
        />
      </svg>

    </div>
  );
}