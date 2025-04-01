import styles from './MedicalAnalysis.module.css';
import { useMemo } from 'react';

export default function MedicalAnalysis({ analysis, title = "Detailed Analysis" }) {
  const parsedContent = useMemo(() => {
    const renderMarkdownParagraph = (text, paraIndex) => {
      const parts = text.split('**');
      // Handle unmatched bold markers
      if (parts.length % 2 === 0) {
        parts.push(''); // Add empty string if odd number of markers
      }
      
      return parts.map((part, index) => {
        const key = `${paraIndex}-${index}`;
        return index % 2 === 1 ? (
          <strong key={key} className={styles.markdownBold}>
            {part}
          </strong>
        ) : (
          part
        );
      });
    };

    return analysis.split('\n\n')
      .filter(section => section.trim()) // Remove empty sections
      .map((section, i) => {
        const sectionKey = `section-${i}`;
        
        if (section.startsWith('### ')) {
          return (
            <h3 key={sectionKey} className={styles.markdownHeading}>
              {section.replace('### ', '')}
            </h3>
          );
        }
        
        const paragraphs = section.split('\n')
          .filter(p => p.trim()) // Remove empty paragraphs
          .map((paragraph, j) => {
            const paraKey = `${sectionKey}-p-${j}`;
            return (
              <p key={paraKey} className={styles.paragraph}>
                {renderMarkdownParagraph(paragraph, paraKey)}
              </p>
            );
          });

        return paragraphs.length > 0 ? (
          <div key={sectionKey} className={styles.section}>
            {paragraphs}
          </div>
        ) : null;
      });
  }, [analysis]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{title}</h3>
        <p className={styles.subtitle}>AI-powered medical insights</p>
      </div>
      <div className={styles.content}>
        {parsedContent}
      </div>
    </div>
  );
}