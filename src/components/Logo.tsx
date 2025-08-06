import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'dark-bg' | 'light-bg';
}

export default function Logo({ 
  className = '', 
  width = 120, 
  height = 60,
  variant = 'default'
}: LogoProps) {
  // For white text on transparent background, we need appropriate backgrounds
  const bgClasses = {
    'default': 'bg-aori-green rounded-lg p-2', // Green background for visibility
    'dark-bg': '', // No background needed on dark backgrounds
    'light-bg': 'bg-aori-green rounded-lg p-2' // Green background on light backgrounds
  };

  return (
    <div className={`inline-flex items-center justify-center ${bgClasses[variant]} ${className}`}>
      <Image
        src="/aori-logo.png"
        alt="Aori"
        width={width}
        height={height}
        className="object-contain"
        priority
        style={{ filter: variant === 'dark-bg' ? 'none' : 'none' }}
      />
    </div>
  );
}