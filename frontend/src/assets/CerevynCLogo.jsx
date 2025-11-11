import React from 'react';

const CerevynCLogo = ({ className = "w-12 h-12" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer C shape - thick crescent curve, open on the right, with rounded ends */}
      <path
        d="M 20 15 C 8 15 2 25 2 50 C 2 75 8 85 20 85"
        stroke="white"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Central circle (eye/pupil) - positioned slightly left of center within the C */}
      <circle
        cx="32"
        cy="50"
        r="7"
        fill="white"
      />
      
      {/* Upper curved line extending horizontally from the right of the central circle */}
      <path
        d="M 39 43 Q 50 40 62 43"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Lower curved line extending horizontally from the right of the central circle */}
      <path
        d="M 39 57 Q 50 60 62 57"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Upper end node circle (small connection point) */}
      <circle
        cx="62"
        cy="43"
        r="2.5"
        fill="white"
      />
      
      {/* Lower end node circle (small connection point) */}
      <circle
        cx="62"
        cy="57"
        r="2.5"
        fill="white"
      />
    </svg>
  );
};

export default CerevynCLogo;

