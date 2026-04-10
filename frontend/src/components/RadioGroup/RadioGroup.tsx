import { forwardRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import styles from './RadioGroup.module.css';

export interface RadioOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<
  InputHTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  name: string;
  options: RadioOption[];
  orientation?: 'vertical' | 'horizontal';
  hasError?: boolean;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      name,
      options,
      orientation = 'vertical',
      hasError = false,
      disabled = false,
      className,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');

    const currentValue = isControlled ? value : uncontrolledValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }

      if (onChange) {
        onChange(e);
      }
    };

    const wrapperClasses = [
      styles.wrapper,
      styles[orientation],
      hasError ? styles.error : '',
      disabled ? styles.disabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div role="radiogroup" className={wrapperClasses} {...props}>
        {options.map((option, index) => {
          const isOptionDisabled = disabled || option.disabled;
          const isChecked = currentValue === option.value;
          const isLast = index === options.length - 1;

          return (
            <label
              key={`${name}-${option.value}`}
              className={`${styles.item} ${isOptionDisabled ? styles.itemDisabled : ''}`}
            >
              <input
                ref={isLast ? ref : undefined}
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                disabled={isOptionDisabled}
                onChange={handleChange}
                className={styles.radio}
              />
              <span className={styles.label}>{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  },
);

RadioGroup.displayName = 'RadioGroup';
