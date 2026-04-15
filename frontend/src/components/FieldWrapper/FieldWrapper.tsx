import type { ReactNode } from 'react';
import styles from './FieldWrapper.module.css';

export interface FieldWrapperProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const FieldWrapper = ({ id, label, error, children, className }: FieldWrapperProps) => {
  const errorId = `${id}-error`;

  return (
    <div className={`${styles.container} ${className ?? ''}`.trim()}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>

      {children}

      {error && (
        <span id={errorId} className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};
