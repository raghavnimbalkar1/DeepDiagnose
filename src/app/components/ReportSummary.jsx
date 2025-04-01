import styles from './ReportSummary.module.css';

export default function ReportSummary({ data }) {
  const extractMetrics = (analysis) => {
    const metrics = [];
    const abnormalPattern = /(\w+)\s*:\s*([\d.]+)\s*\(([↑↓])/g;
    let match;
    
    while ((match = abnormalPattern.exec(analysis)) !== null) {
      metrics.push({
        name: match[1],
        value: match[2],
        status: match[3] === '↑' ? 'high' : 'low'
      });
    }
    
    return metrics.slice(0, 5);
  };

  const metrics = extractMetrics(data.analysis);

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryHeader}>
        <h3>Key Findings</h3>
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
                  <span className={styles.metricName}>{metric.name}:</span> {metric.value}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noAbnormalities}>No abnormalities detected</p>
        )}
      </div>
    </div>
  );
}