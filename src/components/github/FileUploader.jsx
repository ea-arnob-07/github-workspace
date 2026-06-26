import { useState, useRef } from 'react';
import { uploadFilesToRepository } from '../../services/githubUserApi';
import ErrorMessage from '../common/ErrorMessage';
import './FileUploader.css';

export default function FileUploader({ owner, repo, onSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    // Filter out duplicates based on path/name
    setSelectedFiles(prev => {
      const existingPaths = new Set(prev.map(f => f.webkitRelativePath || f.name));
      const filteredNew = newFiles.filter(f => !existingPaths.has(f.webkitRelativePath || f.name));
      return [...prev, ...filteredNew];
    });
    setError(null);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      await uploadFilesToRepository(owner, repo, selectedFiles, (progress) => {
        setUploadProgress(progress);
      });
      
      // Reset after success
      setSelectedFiles([]);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="file-uploader glass-card">
      <h3 className="mb-3">Upload Files</h3>
      <p className="text-secondary mb-4">
        Select files or folders to upload to your repository. 
        Large projects might take a moment.
      </p>
      
      {error && <ErrorMessage message={error} className="mb-3" />}
      
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-icon">📁</div>
        <h4>Drag & drop files here</h4>
        <p className="text-secondary">or</p>
        <div className="upload-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Select Files
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => folderInputRef.current?.click()}
            disabled={isUploading}
          >
            Select Folder
          </button>
        </div>
        
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileSelect}
        />
        <input 
          type="file" 
          webkitdirectory="true" 
          directory="true" 
          multiple 
          ref={folderInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileSelect}
        />
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="selected-files mt-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="m-0">{selectedFiles.length} files selected</h4>
            {!isUploading && (
              <button 
                className="btn btn-sm btn-text text-danger"
                onClick={() => setSelectedFiles([])}
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-name" title={file.webkitRelativePath || file.name}>
                    {file.webkitRelativePath || file.name}
                  </span>
                  <span className="file-size">{formatSize(file.size)}</span>
                </div>
                {!isUploading && (
                  <button className="remove-btn" onClick={() => removeFile(index)}>×</button>
                )}
              </div>
            ))}
          </div>
          
          <div className="upload-control mt-4">
            {isUploading ? (
              <div className="upload-progress-container">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <div className="progress-text text-center mt-2 text-secondary">
                  {uploadProgress < 100 
                    ? `Uploading to backend... ${uploadProgress}%` 
                    : 'Processing commit to GitHub (this may take a minute)...'
                  }
                </div>
              </div>
            ) : (
              <button 
                className="btn btn-primary w-100" 
                onClick={handleUpload}
              >
                Commit changes to GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
