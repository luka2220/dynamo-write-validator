'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hover',
  secondary:
    'bg-bg-tertiary text-text-primary border border-border hover:border-border-hover hover:bg-bg-secondary',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
  danger: 'bg-error text-white hover:bg-red-600',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className = '',
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center rounded-lg font-medium
          transition-colors duration-200 focus:outline-none focus:ring-2
          focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <svg className="mr-3 size-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.314 2.239 6.124 5.292 7.291L6 17.291z"
            />
          </svg>
        )}

        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
