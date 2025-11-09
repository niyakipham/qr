
import React from 'react';

interface SphereProps {
  className: string;
  size: number;
}

export const Sphere: React.FC<SphereProps> = ({ className, size }) => {
  return (
    <div
      className={`absolute rounded-full filter blur-3xl opacity-50 animate-pulse ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};
