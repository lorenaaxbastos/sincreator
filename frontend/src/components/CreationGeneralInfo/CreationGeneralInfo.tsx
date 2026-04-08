import { Info, SquareSplitHorizontal, SquaresUnite } from 'lucide-react';
import { Button } from '../Button/Button';
import { CreationBriefing } from '../CreationBriefing/CreationBriefing';
import { CreationSummary } from '../CreationSummary/CreationSummary';
import { Tooltip } from '../Tooltip/Tooltip';
import styles from './CreationGeneralInfo.module.css';
import type { CreationSummary as CreationSummaryData } from '../../stores/useCreationStore';
import type { CreationBriefingProps } from '../CreationBriefing/CreationBriefing';

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
  const toggleLabel = isSplitScreen ? 'Unificar tela' : 'Dividir tela';

  return (
    <section
      aria-labelledby="creation-general-info-heading"
      className={`${styles.container} ${isSplitScreen ? styles.onsplit : ''}`.trim()}
    >
      <div className={styles.header}>
        <h2 className={styles.title} id="creation-general-info-heading">
          Sobre a <span>formação</span>
        </h2>

        <Tooltip
          position="left"
          content={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Info size={14} aria-hidden="true" />
              <span>{toggleLabel}</span>
            </div>
          }
        >
          <Button
            onClick={onToggleSplitScreen}
            variant="alert"
            size="icon"
            aria-label={toggleLabel}
          >
            <Icon aria-hidden="true" size={24} />
          </Button>
        </Tooltip>
      </div>
      <div className={styles.content}>
        {hasSummary && <CreationSummary data={summaryData} />}
        {hasBriefing && <CreationBriefing {...briefingProps} />}
      </div>
    </section>
  );
};
