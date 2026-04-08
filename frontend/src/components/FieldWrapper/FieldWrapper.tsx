import type { ReactNode } from 'react';
import styles from './FieldWrapper.module.css';

export interface FieldWrapperProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export const FieldWrapper = ({ id, label, error, children }: FieldWrapperProps) => {
  const errorId = `${id}-error`;

  return (
    <div className={styles.container}>
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
