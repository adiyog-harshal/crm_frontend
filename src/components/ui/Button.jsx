import React from 'react';
import './Button.css';

const Button = ({
  variant = 'primary', // 'primary' (navy), 'success' (green), 'outline' (white/navy outline), 'danger' (red)
  icon,
  onClick,
  type = 'button',
  className = '',
  title,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`ui-btn ui-btn-${variant} ${className}`}
      onClick={onClick}
      title={title}
      {...props}
    >
      {icon && <span className="ui-btn-icon">{icon}</span>}
      {children && <span className="ui-btn-text">{children}</span>}
    </button>
  );
};

export default Button;
