import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, className, hasError, resize = 'vertical', ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;

    return (
      <textarea
        id={textareaId}
        ref={ref}
        aria-invalid={!!hasError}
        aria-errormessage={hasError ? errorId : undefined}
        className={`${styles.textarea} ${hasError ? styles.error : ''} ${
          styles[`resize-${resize}`]
        } ${className ?? ''}`.trim()}
        {...props}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
