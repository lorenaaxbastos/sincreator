import { forwardRef, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  hasError?: boolean;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hasError, indeterminate, className, disabled, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node;

      if (node) {
        node.indeterminate = !!indeterminate;
      }

      if (ref) {
        if (typeof ref === 'function') {
          ref(node);
        } else {
          const forwardedRef = ref as { current: HTMLInputElement | null };
          forwardedRef.current = node;
        }
      }
    };

    const wrapperClasses = [
      styles.wrapper,
      hasError ? styles.error : '',
      disabled ? styles.disabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label className={wrapperClasses}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            ref={setRefs}
            disabled={disabled}
            className={styles.input}
            {...props}
          />
          <div className={styles.control} aria-hidden="true" />
        </div>
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
