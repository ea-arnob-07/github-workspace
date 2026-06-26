import { useMemo } from 'react';
import './FileTree.css';

/**
 * Binary file extensions that cannot be previewed as text.
 */
const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'svg', 'webp', 'avif',
  'mp4', 'webm', 'mov', 'avi', 'mkv', 'mp3', 'wav', 'ogg', 'flac',
  'pdf', 'zip', 'tar', 'gz', 'rar', '7z', 'bz2', 'xz',
  'exe', 'dll', 'so', 'dylib', 'bin', 'dat',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  'psd', 'ai', 'sketch', 'fig',
  'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'sqlite', 'db',
]);

/**
 * Check if a filename has a binary extension.
 * @param {string} name
 * @returns {boolean}
 */
export function isBinaryFile(name) {
  const ext = name.split('.').pop()?.toLowerCase();
  return BINARY_EXTENSIONS.has(ext);
}

/**
 * Format file size to human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * FileTree — Displays repository files and folders with breadcrumb navigation.
 * @param {{
 *   items: Array,
 *   currentPath: string,
 *   selectedFile: Object|null,
 *   loading: boolean,
 *   error: string|null,
 *   onFolderClick: Function,
 *   onFileClick: Function,
 *   onBreadcrumbClick: Function,
 *   onRetry: Function
 * }} props
 */
export default function FileTree({
  items,
  currentPath,
  selectedFile,
  loading,
  error,
  onFolderClick,
  onFileClick,
  onBreadcrumbClick,
  onRetry,
}) {
  // Sort: folders first, then files, both alphabetically
  const sortedItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return [...items].sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [items]);

  // Build breadcrumb segments
  const breadcrumbs = useMemo(() => {
    const segments = [{ name: 'root', path: '' }];
    if (currentPath) {
      const parts = currentPath.split('/');
      parts.forEach((part, idx) => {
        segments.push({
          name: part,
          path: parts.slice(0, idx + 1).join('/'),
        });
      });
    }
    return segments;
  }, [currentPath]);

  return (
    <div className="file-tree">
      {/* Breadcrumb */}
      <div className="file-tree-breadcrumb">
        {breadcrumbs.map((crumb, idx) => (
          <span key={crumb.path} className="breadcrumb-segment">
            {idx > 0 && <span className="breadcrumb-sep">/</span>}
            <button
              className={`breadcrumb-btn ${idx === breadcrumbs.length - 1 ? 'breadcrumb-active' : ''}`}
              onClick={() => onBreadcrumbClick(crumb.path)}
              disabled={idx === breadcrumbs.length - 1}
            >
              {idx === 0 ? '📦' : '📁'} {crumb.name}
            </button>
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="file-tree-list">
        {loading && (
          <div className="file-tree-loading">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="file-tree-skeleton">
                <div className="skeleton-icon" />
                <div className="skeleton-name" />
                <div className="skeleton-size" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="file-tree-error">
            <span className="file-tree-error-icon">⚠️</span>
            <p>{error}</p>
            {onRetry && (
              <button className="btn btn-secondary" onClick={onRetry}>
                🔄 Retry
              </button>
            )}
          </div>
        )}

        {!loading && !error && sortedItems.length === 0 && (
          <div className="file-tree-empty">
            <span className="file-tree-empty-icon">📭</span>
            <p>This directory is empty</p>
          </div>
        )}

        {!loading && !error && sortedItems.map((item) => {
          const isDir = item.type === 'dir';
          const isSelected = selectedFile && selectedFile.path === item.path;
          const binary = !isDir && isBinaryFile(item.name);

          return (
            <button
              key={item.sha || item.name}
              className={`file-tree-item ${isDir ? 'file-tree-dir' : 'file-tree-file'} ${isSelected ? 'file-tree-item-active' : ''}`}
              onClick={() => isDir ? onFolderClick(item) : onFileClick(item)}
              title={item.path}
            >
              <span className="file-tree-item-icon">
                {isDir ? '📁' : binary ? '📎' : '📄'}
              </span>
              <span className="file-tree-item-name">{item.name}</span>
              {!isDir && item.size != null && (
                <span className="file-tree-item-size">{formatFileSize(item.size)}</span>
              )}
              {isDir && <span className="file-tree-item-arrow">›</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
