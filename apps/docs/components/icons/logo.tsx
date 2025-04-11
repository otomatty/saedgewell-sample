import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo = ({ className = '', size = 24 }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
        aria-labelledby="cycleLogoTitle"
        role="img"
      >
        <title id="cycleLogoTitle">Cycle Logo</title>
        {/* 循環を表す円形の矢印 */}
        <path
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
          fill="currentColor"
        />
        <path
          d="M16.5 7.5L18 6M18 6L16.5 4.5M18 6H14.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 16.5L6 18M6 18L7.5 19.5M6 18L9.5 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-bold text-lg tracking-tight">Cycle</span>
    </div>
  );
};
