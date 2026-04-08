import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { EyeClosed, Eye } from 'lucide-react';
import styles from './TextInput.module.css';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ id, className, type, hasError, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const isPasswordType = type === 'password';
    const inputType = isPasswordType && isPasswordVisible ? 'text' : type;

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(prev => !prev);
    };

    return (
      <div className={styles.inputWrapper}>
        <input
          id={inputId}
          ref={ref}
          type={inputType}
          aria-invalid={!!hasError}
          aria-errormessage={hasError ? errorId : undefined}
          className={`${styles.input} ${hasError ? styles.error : ''} ${
            isPasswordType ? styles.passwordInput : ''
          } ${className ?? ''}`.trim()}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.toggleButton}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <Eye /> : <EyeClosed />}
          </button>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
