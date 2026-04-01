import { Info, SquareSplitHorizontal, SquaresUnite } from 'lucide-react';
import { CreationBriefing } from '../CreationBriefing/CreationBriefing';
import { CreationSummary } from '../CreationSummary/CreationSummary';
import styles from './CreationGeneralInfo.module.css';
import type { CreationBriefingProps } from '../CreationBriefing/CreationBriefing';
import type { CreationSummaryData } from '../CreationSummary/CreationSummary';

interface CreationGeneralInfoProps {
  summaryData?: CreationSummaryData | null;
  briefingProps?: CreationBriefingProps | null;
  isSplitScreen: boolean;
  onToggleSplitScreen: () => void;
}

export const CreationGeneralInfo = ({
  summaryData,
  briefingProps,
  isSplitScreen,
  onToggleSplitScreen,
}: CreationGeneralInfoProps) => {
  const hasSummary =
    summaryData &&
    Object.values(summaryData).some(val => val !== undefined && val !== null && val !== '');
  const hasBriefing = briefingProps && !!briefingProps.content;

  if (!hasSummary && !hasBriefing) return null;

  const Icon = isSplitScreen ? SquaresUnite : SquareSplitHorizontal;

  return (
    <section
      aria-labelledby="creation-general-info-heading"
      className={`${styles.container} ${isSplitScreen ? styles.onsplit : ''}`.trim()}
    >
      <div className={styles.header}>
        <h2 className={styles.title} id="creation-general-info-heading">
          Sobre a <span>formação</span>
        </h2>
        <button onClick={onToggleSplitScreen} className={styles.button} aria-label="Dividir tela">
          <Icon className={styles.icon} aria-hidden="true" size={24} />
          <span className={styles.tooltip} aria-hidden="true">
            <Info size={16} />
            {isSplitScreen ? 'Unificar tela' : 'Dividir tela'}
          </span>
        </button>
      </div>
      <div className={styles.content}>
        {hasSummary && <CreationSummary data={summaryData} />}
        {hasBriefing && <CreationBriefing {...briefingProps} />}
      </div>
    </section>
  );
};
