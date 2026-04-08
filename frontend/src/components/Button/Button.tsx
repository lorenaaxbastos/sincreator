import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'alert' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'default',
      size = 'md',
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = !!disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${
          isLoading ? styles.loading : ''
        } ${className ?? ''}`.trim()}
        {...props}
      >
        <span className={styles.content}>
          {isLoading && <Loader2 className={styles.spinner} size={18} aria-hidden="true" />}
          {children}
        </span>
      </button>
    );
  },
);

Button.displayName = 'Button';
