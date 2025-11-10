
import React from 'react';

interface IconProps {
  className?: string;
  color?: string;
}

export const UploadIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const BankIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M3 21h18" />
        <path d="M5 18v-8" />
        <path d="M9 18v-8" />
        <path d="M15 18v-8" />
        <path d="M19 18v-8" />
        <path d="M3 7l9-4 9 4" />
        <path d="M3 10h18" />
    </svg>
);

export const LinkIcon: React.FC<IconProps> = ({ className, color = 'currentColor' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
    </svg>
);
