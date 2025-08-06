'use client';

export default function WaveBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated SVG waves */}
      <svg 
        className="absolute top-0 left-0 w-full h-full animate-wave-slow"
        viewBox="0 0 1200 600" 
        preserveAspectRatio="none"
        style={{ zIndex: -1 }}
      >
        <path
          d="M0,100 C300,150 600,50 900,100 C1050,125 1150,100 1200,100 L1200,0 L0,0 Z"
          fill="rgba(255,255,255,0.02)"
        />
        <path
          d="M0,200 C400,250 800,150 1200,200 L1200,0 L0,0 Z"
          fill="rgba(255,255,255,0.015)"
        />
      </svg>
      
      <svg 
        className="absolute top-0 right-0 w-full h-full animate-wave-medium"
        viewBox="0 0 1200 600" 
        preserveAspectRatio="none"
        style={{ zIndex: -1 }}
      >
        <path
          d="M1200,150 C900,100 600,200 300,150 C150,125 50,150 0,150 L0,0 L1200,0 Z"
          fill="rgba(255,255,255,0.02)"
        />
      </svg>

      <svg 
        className="absolute bottom-0 left-0 w-full h-full animate-wave-fast"
        viewBox="0 0 1200 600" 
        preserveAspectRatio="none"
        style={{ zIndex: -1 }}
      >
        <path
          d="M0,500 C300,450 600,550 900,500 C1050,475 1150,500 1200,500 L1200,600 L0,600 Z"
          fill="rgba(255,255,255,0.025)"
        />
        <path
          d="M0,400 C400,350 800,450 1200,400 L1200,600 L0,600 Z"
          fill="rgba(255,255,255,0.02)"
        />
      </svg>
    </div>
  );
}