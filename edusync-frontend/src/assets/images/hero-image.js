import React from 'react';

const HeroImage = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066ff" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#2684ff" stopOpacity="0.9"/>
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="600" height="400" rx="10" fill="url(#grad1)" />
      
      {/* Laptop */}
      <rect x="150" y="150" width="300" height="180" rx="10" fill="#333" />
      <rect x="160" y="160" width="280" height="150" rx="5" fill="#222" stroke="#444" strokeWidth="2" />
      <rect x="170" y="170" width="260" height="130" fill="#0a2a5e" />
      
      {/* Screen Content */}
      <rect x="190" y="190" width="80" height="10" rx="5" fill="#fff" opacity="0.7" />
      <rect x="190" y="210" width="120" height="10" rx="5" fill="#fff" opacity="0.5" />
      <rect x="190" y="230" width="100" height="10" rx="5" fill="#fff" opacity="0.3" />
      
      {/* Laptop Base */}
      <path d="M120,330 L480,330 L450,370 L150,370 Z" fill="#444" />
      
      {/* Books */}
      <rect x="490" y="230" width="40" height="140" rx="2" fill="#e74c3c" />
      <rect x="485" y="220" width="40" height="140" rx="2" fill="#3498db" transform="rotate(-5,485,220)" />
      <rect x="480" y="210" width="40" height="140" rx="2" fill="#2ecc71" transform="rotate(-10,480,210)" />
      
      {/* Graduate Cap */}
      <rect x="80" y="180" width="100" height="10" fill="#333" />
      <polygon points="130,130 80,180 180,180" fill="#333" />
      <circle cx="130" cy="130" r="10" fill="#f1c40f" />
      <rect x="125" y="180" width="5" height="30" fill="#333" />
      <circle cx="127.5" cy="210" r="10" fill="#f1c40f" />
      
      {/* Charts */}
      <rect x="30" y="250" width="100" height="80" rx="5" fill="#fff" opacity="0.8" />
      <rect x="40" y="260" width="15" height="60" fill="#3498db" />
      <rect x="60" y="280" width="15" height="40" fill="#2ecc71" />
      <rect x="80" y="270" width="15" height="50" fill="#e74c3c" />
      <rect x="100" y="290" width="15" height="30" fill="#f1c40f" />
      
      {/* Floating Elements */}
      <circle cx="50" cy="50" r="15" fill="#fff" opacity="0.3" />
      <circle cx="80" cy="70" r="10" fill="#fff" opacity="0.2" />
      <circle cx="500" cy="100" r="20" fill="#fff" opacity="0.2" />
      <circle cx="540" cy="130" r="12" fill="#fff" opacity="0.3" />
      <circle cx="450" cy="50" r="18" fill="#fff" opacity="0.2" />
      
      {/* Code Brackets */}
      <text x="350" y="230" fontFamily="monospace" fontSize="30" fill="#fff" opacity="0.7">{'{'}</text>
      <text x="370" y="230" fontFamily="monospace" fontSize="30" fill="#fff" opacity="0.7">{'}'}</text>
      <text x="390" y="230" fontFamily="monospace" fontSize="30" fill="#fff" opacity="0.7">{'<'}</text>
      <text x="410" y="230" fontFamily="monospace" fontSize="30" fill="#fff" opacity="0.7">{'>'}</text>
    </svg>
  );
};

export default HeroImage;
