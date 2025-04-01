import styles from './ReportSummary.module.css';

export default function ReportSummary({ data }) {
  const extractMetrics = (analysis) => {
    const metrics = [];
    // Simple pattern to match test name, value, and status
    const rowPattern = /^\|([^\|]+)\|([^\|]+)\|[^\|]+\|\s*(↑|↓)\s*(High|Low)/gm;
    let match;
    
    while ((match = rowPattern.exec(analysis)) !== null) {
      metrics.push({
        name: match[1].trim(),
        value: match[2].trim(),
        status: match[3] === '↑' ? 'high' : 'low'
      });
    }
    
    return metrics.slice(0, 5); // Return top 5 abnormalities
  };

  const metrics = extractMetrics(data.analysis);

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryHeader}>
        <h3>Key Findings</h3>
        <p className={styles.subtitle}>Top Abnormal Results</p>
      </div>
      
      <div className={styles.metricsContainer}>
        {metrics.length > 0 ? (
          <ul className={styles.metricsList}>
            {metrics.map((metric, i) => (
              <li key={i} className={styles.metricItem}>
                <span className={`${styles.metricIndicator} ${metric.status === 'high' ? styles.highValue : styles.lowValue}`}>
                  {metric.status === 'high' ? '↑' : '↓'}
                </span>
                <span className={styles.metricText}>
                  <span className={styles.metricName}>{metric.name}:</span> 
                  <span className={styles.metricValue}>{metric.value}</span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noAbnormalities}>No abnormal results found</p>
        )}
      </div>
    </div>
  );
}