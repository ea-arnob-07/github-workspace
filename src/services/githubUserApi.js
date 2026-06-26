/**
 * githubUserApi.js
 * Frontend wrapper for backend GitHub proxy endpoints.
 */

const API_BASE = '/api/github';

export const getMyRepositories = async () => {
  const res = await fetch(`${API_BASE}/my-repos`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch repositories');
  }
  return data.repos;
};

export const createRepository = async (repoData) => {
  const res = await fetch(`${API_BASE}/repos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(repoData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to create repository');
  }
  return data.repo;
};

export const uploadFilesToRepository = async (owner, repo, files, onProgress) => {
  const formData = new FormData();
  
  // Keep original paths relative to selected folder if possible,
  // HTML file inputs with webkitdirectory provide webkitRelativePath
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // Attach the relative path so the backend can recreate the tree
    // If not a directory upload, webkitRelativePath is empty, fallback to name
    const filePath = file.webkitRelativePath || file.name;
    formData.append('files', file, filePath);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            resolve(data);
          } else {
            reject(new Error(data.message || 'Upload failed'));
          }
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          reject(new Error(data.message || `Upload failed with status ${xhr.status}`));
        } catch (e) {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during upload'));
    };

    xhr.open('POST', `${API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/upload`);
    xhr.send(formData);
  });
};

export const enableGitHubPages = async (owner, repo, branch, path) => {
  const res = await fetch(`${API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ branch, path }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to enable GitHub Pages');
  }
  return data;
};

export const getGitHubPagesStatus = async (owner, repo) => {
  const res = await fetch(`${API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/pages/status`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to fetch GitHub Pages status');
  }
  return data.status;
};
