import { useState, useId, cloneElement, isValidElement } from 'react';
import type {
  ReactElement,
  ReactNode,
  MouseEvent,
  FocusEvent,
  KeyboardEvent,
  HTMLAttributes,
} from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: string | ReactNode;
  children: ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip = ({ content, children, position = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  if (!isValidElement(children)) {
    console.warn('O children do Tooltip deve ser um elemento React válido.');
    return <>{children}</>;
  }

  const childProps = children.props as HTMLAttributes<HTMLElement>;

  const trigger = cloneElement(children, {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      show();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      hide();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      show();
      childProps.onFocus?.(e);
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      hide();
      childProps.onBlur?.(e);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Escape') hide();
      childProps.onKeyDown?.(e);
    },
    'aria-describedby': isVisible ? tooltipId : childProps['aria-describedby'],
  } as HTMLAttributes<HTMLElement>);

  return (
    <div className={styles.container}>
      {trigger}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`${styles.tooltipBubble} ${styles[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
