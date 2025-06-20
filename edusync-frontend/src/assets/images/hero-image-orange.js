import React from 'react';

const HeroImageOrange = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7F27" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#E65100" stopOpacity="0.9"/>
        </linearGradient>
        <linearGradient id="tealAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00796B" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#004D40" stopOpacity="0.9"/>
        </linearGradient>
      </defs>
      
      {/* Background with diagonal split */}
      <path d="M0,0 L600,0 L600,400 L0,400 Z" fill="url(#orangeGrad)" />
      <path d="M400,0 L600,0 L600,400 L200,400 Z" fill="url(#tealAccent)" opacity="0.3" />
      
      {/* Decorative Elements */}
      <circle cx="50" cy="50" r="30" fill="#FFAB91" opacity="0.5" />
      <circle cx="550" cy="350" r="40" fill="#B2DFDB" opacity="0.5" />
      <circle cx="300" cy="200" r="100" fill="#FFF3E0" opacity="0.1" />
      
      {/* Geometric Patterns */}
      <polygon points="100,50 150,150 50,150" fill="#FFAB91" opacity="0.3" />
      <polygon points="500,250 550,350 450,350" fill="#B2DFDB" opacity="0.3" />
      
      {/* Main Content - Modern Learning Device */}
      <rect x="200" y="120" width="200" height="140" rx="10" fill="#333" />
      <rect x="210" y="130" width="180" height="110" rx="5" fill="#222" />
      <rect x="220" y="140" width="160" height="90" fill="#FFAB91" opacity="0.7" />
      
      {/* Screen Content */}
      <rect x="240" y="160" width="60" height="8" rx="4" fill="#fff" />
      <rect x="240" y="180" width="120" height="8" rx="4" fill="#fff" opacity="0.7" />
      <rect x="240" y="200" width="80" height="8" rx="4" fill="#fff" opacity="0.5" />
      
      {/* Abstract Education Icons */}
      {/* Graduation Cap */}
      <polygon points="150,260 170,240 190,260 170,280" fill="#E65100" />
      <circle cx="170" cy="260" r="5" fill="#FFF3E0" />
      
      {/* Book */}
      <rect x="400" y="270" width="30" height="40" rx="2" fill="#00796B" />
      <rect x="400" y="270" width="15" height="40" rx="0" fill="#004D40" />
      
      {/* Chart */}
      <rect x="450" y="180" width="80" height="60" rx="5" fill="#FFFFFF" opacity="0.9" />
      <rect x="460" y="190" width="10" height="40" fill="#FF7F27" />
      <rect x="475" y="200" width="10" height="30" fill="#E65100" />
      <rect x="490" y="210" width="10" height="20" fill="#00796B" />
      <rect x="505" y="195" width="10" height="35" fill="#004D40" />
      
      {/* Digital Elements */}
      <circle cx="100" cy="320" r="25" fill="#FFFFFF" opacity="0.2" />
      <text x="88" cy="327" fontFamily="monospace" fontSize="20" fill="#FFFFFF">01</text>
      
      <circle cx="500" cy="80" r="25" fill="#FFFFFF" opacity="0.2" />
      <text x="488" cy="87" fontFamily="monospace" fontSize="20" fill="#FFFFFF">10</text>
      
      {/* Flying Papers */}
      <rect x="80" y="200" width="25" height="30" rx="2" fill="#FFFFFF" opacity="0.6" transform="rotate(15,80,200)" />
      <rect x="350" y="70" width="25" height="30" rx="2" fill="#FFFFFF" opacity="0.6" transform="rotate(-15,350,70)" />
      <rect x="480" y="140" width="25" height="30" rx="2" fill="#FFFFFF" opacity="0.6" transform="rotate(25,480,140)" />
      
      {/* Connection Lines */}
      <line x1="150" y1="100" x2="200" y2="150" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
      <line x1="450" y1="300" x2="400" y2="250" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
      <line x1="300" y1="100" x2="300" y2="150" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
      
      {/* Modern Education Text */}
      <text x="50" y="380" fontFamily="Arial, sans-serif" fontSize="12" fill="#FFFFFF" opacity="0.7">MODERN EDUCATION</text>
      <text x="450" y="50" fontFamily="Arial, sans-serif" fontSize="12" fill="#FFFFFF" opacity="0.7">DIGITAL LEARNING</text>
    </svg>
  );
};

export default HeroImageOrange;
