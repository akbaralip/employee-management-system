import React from 'react';
import type { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    {title && <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>}
    {children}
  </div>
);

export default Card;