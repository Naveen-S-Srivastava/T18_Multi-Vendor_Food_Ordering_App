import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  shadow = 'md',
  padding = true,
  hover = false,
  onClick,
  ...props 
}) => {
  const classNames = [
    'card',
    `shadow-${shadow}`,
    padding && 'card-padding',
    hover && 'card-hover',
    onClick && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
