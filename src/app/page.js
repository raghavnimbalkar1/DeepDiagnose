"use client";
import { useState } from 'react';
import FileUploader from './components/FileUploader';
import MedicalAnalysis from './components/MedicalAnalysis';
import ChatInterface from './components/ChatInterface';
import ReportSummary from './components/ReportSummary';
import './globals.css';

export default function MedicalReportAnalyzer() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="title">Medical Report Analyzer</h1>
        </div>
      </header>

      <main className="main-content">
        <div className="grid-container">
          {/* Left Column */}
          <div>
            <FileUploader 
              onUploadStart={() => setIsLoading(true)}
              onUploadSuccess={(data) => {
                setReportData(data);
                setIsLoading(false);
              }}
              onUploadError={(error) => {
                console.error(error);
                setIsLoading(false);
              }}
            />
            
            {reportData && (
              <ReportSummary data={reportData} />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y">
            {reportData ? (
              <>
                <MedicalAnalysis analysis={reportData.analysis} />
                <ChatInterface 
                  reportContext={reportData.analysis}
                  chatHistory={chatHistory}
                  setChatHistory={setChatHistory}
                />
              </>
            ) : (
              <div className="card text-center">
                <h3 className="subtitle">
                  {isLoading ? 'Analyzing your report...' : 'Upload a medical report to begin'}
                </h3>
                {isLoading && (
                  <div className="flex-center" style={{ marginTop: '1rem' }}>
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}