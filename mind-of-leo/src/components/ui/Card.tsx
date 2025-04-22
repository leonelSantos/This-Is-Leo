import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'small' | 'medium' | 'large';
  radius?: 'none' | 'small' | 'medium' | 'large';
  isHoverable?: boolean;
  isClickable?: boolean;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'medium',
  radius = 'medium',
  isHoverable = false,
  isClickable = false,
  className = '',
  ...props
}: CardProps) {
  const baseClasses = 'bg-white overflow-hidden';
  
  const variantClasses = {
    default: '',
    bordered: 'border border-gray-200',
    elevated: 'shadow-md',
  };
  
  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-5',
    large: 'p-8',
  };
  
  const radiusClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
  };
  
  const hoverableClass = isHoverable
    ? 'transition-shadow duration-200 hover:shadow-lg'
    : '';
  
  const clickableClass = isClickable
    ? 'cursor-pointer'
    : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    radiusClasses[radius],
    hoverableClass,
    clickableClass,
    className,
  ].join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// Sub-components
Card.Header = function CardHeader({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-lg font-bold ${className}`} {...props}>
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-gray-600 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

Card.Content = function CardContent({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Image = function CardImage({
  src,
  alt = '',
  className = '',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full object-cover ${className}`}
      {...props}
    />
  );
};