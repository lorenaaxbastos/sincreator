import styles from './CreationSummary.module.css';

export interface CreationSummaryData {
  name?: string | null;
  format?: string | null;
  duration?: number | null;
  qtyPeople?: number | null;
  qtySessions?: number | null;
  isAtTheSameTime?: boolean | null;
  target?: string | null;
  dateAndHour?: string | null;
  place?: string | null;
}

interface CreationSummaryProps {
  data: CreationSummaryData;
}

const SUMMARY_MAP = {
  name: 'Nome',
  format: 'Formato',
  duration: 'Duração',
  qtyPeople: 'Quantidade de participantes',
  qtySessions: 'Quantidade de turmas',
  isAtTheSameTime: 'Tipo de aplicação',
  target: 'Público-alvo',
  dateAndHour: 'Data(s) e horário(s)',
  place: 'Local',
};

export const CreationSummary = ({ data }: CreationSummaryProps) => {
  const validEntries = Object.entries(data).filter(([key, value]) => {
    if (value === undefined || value === null || value === '') return false;

    if (key === 'isAtTheSameTime' && (!data.qtySessions || data.qtySessions <= 1)) {
      return false;
    }

    return true;
  });

  if (validEntries.length === 0) return null;

  return (
    <section className={styles.container} aria-labelledby="summary-title">
      <h3 id="summary-title" className={styles.title}>
        Dados da formação
      </h3>
      <dl className={styles.list}>
        {validEntries.map(([key, value]) => {
          const typedKey = key as keyof typeof SUMMARY_MAP;

          let displayValue: React.ReactNode = value as React.ReactNode;
          if (typedKey === 'isAtTheSameTime') {
            displayValue = value ? 'Síncrona' : 'Assíncrona';
          }

          return (
            <div key={key} className={styles.item}>
              <dt className={styles.term}>{SUMMARY_MAP[typedKey]}</dt>
              <dd className={styles.description}>{displayValue}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
};
