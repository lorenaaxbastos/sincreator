import { forwardRef, useState } from 'react';
import type {
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  InputHTMLAttributes,
} from 'react';
import { Minus, Plus } from 'lucide-react';
import styles from './NumberInput.module.css';

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  hasError?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      hasError = false,
      min,
      max,
      step = 1,
      disabled = false,
      onChange,
      onBlur,
      onKeyDown,
      defaultValue,
      value,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;

    const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
      if (defaultValue !== undefined) return String(defaultValue);
      return '';
    });

    const currentValue = isControlled ? String(value) : uncontrolledValue;
    const numericInternal = currentValue === '' ? Number(min ?? 0) : Number(currentValue);

    const dispatchSyntheticEvent = (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }

      if (onChange) {
        const event = {
          target: { value: newValue, name: props.name },
          currentTarget: { value: newValue, name: props.name },
        } as unknown as ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    const handleIncrement = (e?: MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault();

      const next = numericInternal + Number(step);
      const clamped = max !== undefined ? Math.min(next, Number(max)) : next;
      dispatchSyntheticEvent(String(clamped));
    };

    const handleDecrement = (e?: MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault();

      const next = numericInternal - Number(step);
      const clamped = min !== undefined ? Math.max(next, Number(min)) : next;
      dispatchSyntheticEvent(String(clamped));
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9-]/g, '');
      dispatchSyntheticEvent(rawValue);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      let finalValue = parseInt(currentValue, 10);

      if (isNaN(finalValue)) {
        finalValue = Number(min ?? 0);
      } else {
        if (min !== undefined && finalValue < Number(min)) finalValue = Number(min);
        if (max !== undefined && finalValue > Number(max)) finalValue = Number(max);
      }

      if (currentValue !== String(finalValue)) {
        dispatchSyntheticEvent(String(finalValue));
      }

      if (onBlur) onBlur(e);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }

      if (onKeyDown) onKeyDown(e);
    };

    const isDecreaseDisabled = disabled || (min !== undefined && numericInternal <= Number(min));
    const isIncreaseDisabled = disabled || (max !== undefined && numericInternal >= Number(max));

    const wrapperClasses = [
      styles.wrapper,
      hasError ? styles.error : '',
      disabled ? styles.disabled : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClasses}>
        <button
          type="button"
          className={styles.button}
          onClick={handleDecrement}
          disabled={isDecreaseDisabled}
          aria-label="Diminuir valor"
          tabIndex={-1}
        >
          <Minus size={16} aria-hidden="true" />
        </button>

        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          className={styles.input}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          {...props}
        />

        <button
          type="button"
          className={styles.button}
          onClick={handleIncrement}
          disabled={isIncreaseDisabled}
          aria-label="Aumentar valor"
          tabIndex={-1}
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    );
  },
);

NumberInput.displayName = 'NumberInput';
