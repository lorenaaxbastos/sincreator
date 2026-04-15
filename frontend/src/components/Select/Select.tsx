import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  hasError?: boolean;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, className, options, hasError, placeholder, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          ref={ref}
          defaultValue={placeholder ? '' : undefined}
          aria-invalid={!!hasError}
          aria-errormessage={hasError ? errorId : undefined}
          className={`${styles.select} ${hasError ? styles.error : ''} ${className ?? ''}`.trim()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className={styles.iconWrapper} aria-hidden="true">
          <ChevronDown size={20} />
        </div>
      </div>
    );
  },
);

Select.displayName = 'Select';
