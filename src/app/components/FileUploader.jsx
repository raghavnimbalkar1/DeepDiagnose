"use client";
import { useState } from 'react';
import styles from './FileUploader.module.css';

export default function FileUploader({ onUploadStart, onUploadSuccess, onUploadError }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    
    onUploadStart();
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      onUploadSuccess(data);
    } catch (error) {
      onUploadError(error.message || 'Upload failed');
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadContent}>
        <div className={styles.uploadSection}>
          <label className={styles.uploadLabel}>
            Upload Medical Report
          </label>
          <div className={styles.fileInputContainer}>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setFile(e.target.files[0])}
              className={styles.fileInput}
            />
          </div>
          <p className={styles.fileHint}>
            PDF or TXT files (max 10MB)
          </p>
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`${styles.uploadButton} ${!file ? styles.disabledButton : ''}`}
        >
          Analyze Report
        </button>
      </div>
    </div>
  );
}