import React from 'react';
import './EducationIcons.css';

const EducationIcons = () => {
  return (
    <div className="education-icons">
      {/* Graduation Cap */}
      <div className="floating-icon graduation-cap">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="rgba(255,255,255,0.7)" />
          <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>
      
      {/* Book */}
      <div className="floating-icon book">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.2)"/>
        </svg>
      </div>
      
      {/* Science */}
      <div className="floating-icon science">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2V6M14 2V6M8 14H16M8 18H12M7 22H17C18.1046 22 19 21.1046 19 20V10C19 8.89543 18.1046 8 17 8H7C5.89543 8 5 8.89543 5 10V20C5 21.1046 5.89543 22 7 22Z" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* Calculator */}
      <div className="floating-icon calculator">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="16" height="20" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="rgba(255,255,255,0.2)"/>
          <path d="M8 6H16" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 14H8.01" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 14H12.01" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 14H16.01" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M8 18H8.01" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 18H12.01" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 18H16.01" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* Globe */}
      <div className="floating-icon globe">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="rgba(255,255,255,0.1)"/>
          <path d="M2 12H22" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
        </svg>
      </div>
      
      {/* Atom */}
      <div className="floating-icon atom">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.8)"/>
          <path d="M12 6C16.9706 6 21 8.68629 21 12C21 15.3137 16.9706 18 12 18C7.02944 18 3 15.3137 3 12C3 8.68629 7.02944 6 12 6Z" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4.34314 15.5C6.73608 17.25 9.36522 18 12 18C8.686 15.7689 6.73608 12.75 6.73608 12C6.73608 11.25 8.686 8.23112 12 6C9.36522 6 6.73608 6.75 4.34314 8.5C3.46863 9.5 3 10.75 3 12C3 13.25 3.46863 14.5 4.34314 15.5Z" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.6569 8.5C17.2639 6.75 14.6348 6 12 6C15.314 8.23112 17.2639 11.25 17.2639 12C17.2639 12.75 15.314 15.7689 12 18C14.6348 18 17.2639 17.25 19.6569 15.5C20.5314 14.5 21 13.25 21 12C21 10.75 20.5314 9.5 19.6569 8.5Z" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* Ruler */}
      <div className="floating-icon ruler">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12H22" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 8V16" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 7V17" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 8V16" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
};

export default EducationIcons;
