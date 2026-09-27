import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variants = {
  primary:
    'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-[var(--btn-shadow)] hover:brightness-105',
  secondary:
    'bg-white text-emerald-800 border border-emerald-100 shadow-sm hover:shadow-md hover:translate-y-0.5 transform',
  ghost: 'bg-[var(--btn-ghost-bg)] text-emerald-800 backdrop-blur-sm hover:brightness-105',
  amber:
    'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-[0_8px_20px_rgba(245,158,11,0.12)] hover:brightness-105',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-[var(--btn-radius)]',
  md: 'px-6 py-2.5 text-base rounded-[var(--btn-radius)]',
  lg: 'px-9 py-3.5 text-lg rounded-[var(--btn-radius)]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`nt-btn nt-btn-${variant} inline-flex items-center justify-center gap-2 font-semibold transition-all transform will-change-transform disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
