import type { ReactNode } from 'react';
import styles from './CreationBriefing.module.css';

export interface CreationBriefingProps {
  content: ReactNode;
  variant: 'free' | 'constrained';
}

export const CreationBriefing = ({ content, variant }: CreationBriefingProps) => {
  if (!content) return null;

  return (
    <section className={styles.container} aria-labelledby="briefing-title">
      <h3 id="briefing-title" className={styles.title}>
        Briefing
      </h3>
      <div
        data-testid="briefing-box"
        className={`${styles.box} ${variant === 'constrained' ? styles.constrained : ''}`.trim()}
        tabIndex={variant === 'constrained' ? 0 : undefined}
      >
        {content}
      </div>
    </section>
  );
};
