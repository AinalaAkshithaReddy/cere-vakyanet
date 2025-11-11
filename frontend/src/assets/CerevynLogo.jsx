import React from 'react';

const CerevynLogo = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main C shape - open bracket/curve facing right */}
      <path
        d="M 25 20 C 15 20 10 30 10 50 C 10 70 15 80 25 80"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Central circle (eye/pupil) */}
      <circle
        cx="35"
        cy="50"
        r="8"
        fill="white"
      />
      
      {/* Top inner curved line from center circle */}
      <path
        d="M 43 42 Q 55 38 68 42"
        stroke="white"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Bottom inner curved line from center circle */}
      <path
        d="M 43 58 Q 55 62 68 58"
        stroke="white"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Top node circle at the end */}
      <circle
        cx="68"
        cy="42"
        r="3.5"
        fill="white"
      />
      
      {/* Bottom node circle at the end */}
      <circle
        cx="68"
        cy="58"
        r="3.5"
        fill="white"
      />
    </svg>
  );
};

export default CerevynLogo;

