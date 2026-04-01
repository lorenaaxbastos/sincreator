import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './CollapsablePanel.module.css';

interface CollapsablePanelProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleId?: string;
}

export const CollapsablePanel = ({
  title,
  children,
  defaultExpanded = true,
  headingLevel: Heading = 'h3',
  titleId,
}: CollapsablePanelProps) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const togglePanel = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={styles.container}>
      <Heading id={titleId} className={styles.heading}>
        <button
          onClick={togglePanel}
          aria-controls="collapsable-panel-content"
          aria-expanded={isOpen}
          className={styles.button}
        >
          <ChevronDown
            aria-hidden="true"
            className={`${styles.icon} ${isOpen ? '' : styles.collapsed}`.trim()}
            size={22}
          />{' '}
          {title}
        </button>
      </Heading>
      <div
        id="collapsable-panel-content"
        data-testid="content-area"
        className={`${styles.content} ${isOpen ? '' : styles.collapsed}`.trim()}
        aria-hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
};
