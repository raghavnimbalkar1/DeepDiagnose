"use client";
import { useState, useRef } from 'react';
import styles from './FileUploader.module.css';

export default function FileUploader({ onUploadStart, onUploadSuccess, onUploadError }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
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
      console.error('Upload error:', error);
      onUploadError(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div 
      className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={styles.content}>
        <div className={styles.uploadArea}>
          <div className={styles.icon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          
          <h3 className={styles.title}>Upload Medical Report</h3>
          
          <p className={styles.description}>
            Drag & drop your file here, or click to browse
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.fileInput}
          />
          
          <button 
            onClick={triggerFileInput}
            className={styles.browseButton}
          >
            Select File
          </button>
          
          {file && (
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
              <button 
                onClick={() => setFile(null)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          )}
          
          <p className={styles.hint}>
            Supported formats: PDF, TXT, DOC, JPG, PNG (max 10MB)
          </p>
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`${styles.uploadButton} ${(!file || isUploading) ? styles.disabled : ''}`}
        >
          {isUploading ? (
            <>
              <span className={styles.spinner}></span>
              Analyzing...
            </>
          ) : (
            'Analyze Report'
          )}
        </button>
      </div>
    </div>
  );
}