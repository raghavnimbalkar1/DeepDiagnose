import styles from './MedicalAnalysis.module.css';

export default function MedicalAnalysis({ analysis }) {
  return (
    <div className={styles.analysisContainer}>
      <div className={styles.analysisHeader}>
        <h3>Report Analysis</h3>
      </div>
      <div className={styles.analysisContent}>
        {analysis.split('\n').map((paragraph, i) => (
          <p key={i} className={styles.analysisParagraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}