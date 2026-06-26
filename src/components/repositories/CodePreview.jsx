import { useState } from 'react';
import { isBinaryFile } from './FileTree';
import './CodePreview.css';

/**
 * Decode Base64-encoded file content from GitHub API.
 * @param {string} encoded
 * @returns {string|null}
 */
function decodeBase64Content(encoded) {
  try {
    return decodeURIComponent(
      atob(encoded.replace(/\n/g, ''))
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    // Fallback for ASCII-only files
    try {
      return atob(encoded.replace(/\n/g, ''));
    } catch {
      return null;
    }
  }
}

/**
 * CodePreview — Displays file content with line numbers, copy button,
 * and link to open the file on GitHub.
 * @param {{
 *   file: Object|null,
 *   loading: boolean,
 *   error: string|null
 * }} props
 */
export default function CodePreview({ file, loading, error }) {
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="code-preview">
        <div className="code-preview-header">
          <div className="code-preview-filename-skeleton" />
        </div>
        <div className="code-preview-body">
          <div className="code-preview-loading">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="code-line-skeleton"
                style={{ width: `${30 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="code-preview">
        <div className="code-preview-placeholder">
          <span className="code-preview-placeholder-icon">⚠️</span>
          <h4>Failed to load file</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="code-preview">
        <div className="code-preview-placeholder">
          <span className="code-preview-placeholder-icon">📂</span>
          <h4>Select a file to preview</h4>
          <p>Click any file in the tree to view its contents</p>
        </div>
      </div>
    );
  }

  // Binary file check
  if (isBinaryFile(file.name)) {
    return (
      <div className="code-preview">
        <div className="code-preview-header">
          <span className="code-preview-filename">📎 {file.name}</span>
          {file.html_url && (
            <a
              href={file.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary code-preview-btn"
            >
              🔗 Open File on GitHub
            </a>
          )}
        </div>
        <div className="code-preview-placeholder">
          <span className="code-preview-placeholder-icon">🚫</span>
          <h4>Preview not available for this file type</h4>
          <p>Binary files cannot be displayed as text.</p>
          {file.html_url && (
            <a
              href={file.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-4"
            >
              Open this file on GitHub
            </a>
          )}
        </div>
      </div>
    );
  }

  // File too large (GitHub returns content: null for files > 1MB)
  if (file.size > 1024 * 1024 || (!file.content && file.size > 0)) {
    return (
      <div className="code-preview">
        <div className="code-preview-header">
          <span className="code-preview-filename">📄 {file.name}</span>
          {file.html_url && (
            <a
              href={file.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary code-preview-btn"
            >
              🔗 Open File on GitHub
            </a>
          )}
        </div>
        <div className="code-preview-placeholder">
          <span className="code-preview-placeholder-icon">📦</span>
          <h4>File is too large to preview</h4>
          <p>This file exceeds the size limit for in-browser preview.</p>
          {file.html_url && (
            <a
              href={file.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-4"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>
    );
  }

  // Decode content
  const decodedCode = file.content ? decodeBase64Content(file.content) : null;

  if (decodedCode === null) {
    return (
      <div className="code-preview">
        <div className="code-preview-header">
          <span className="code-preview-filename">📄 {file.name}</span>
        </div>
        <div className="code-preview-placeholder">
          <span className="code-preview-placeholder-icon">⚠️</span>
          <h4>Unable to decode file content</h4>
          <p>The file content could not be decoded for preview.</p>
          {file.html_url && (
            <a
              href={file.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-4"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>
    );
  }

  const lines = decodedCode.split('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(decodedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = decodedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="code-preview">
      {/* Header */}
      <div className="code-preview-header">
        <span className="code-preview-filename">📄 {file.name}</span>
        <div className="code-preview-header-actions">
          <span className="code-preview-lines-count">
            {lines.length} line{lines.length !== 1 ? 's' : ''}
          </span>
          <button
            className={`btn btn-secondary code-preview-btn ${copied ? 'code-preview-btn-copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✅ Code copied!' : '📋 Copy Code'}
          </button>
          {file.html_url && (
            <a
              href={file.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary code-preview-btn"
            >
              🔗 Open File on GitHub
            </a>
          )}
        </div>
      </div>

      {/* Code Body */}
      <div className="code-preview-body">
        <pre className="code-preview-pre">
          <code className="code-preview-code">
            {lines.map((line, idx) => (
              <div key={idx} className="code-line">
                <span className="code-line-number">{idx + 1}</span>
                <span className="code-line-content">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
