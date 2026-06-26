const axios = require('axios');

const GITHUB_API_URL = 'https://api.github.com';

/**
 * Helper to create an authenticated Axios instance for GitHub API
 */
const getGithubClient = (token) => {
  return axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
};

/**
 * Exchange OAuth code for an access token
 */
exports.exchangeCodeForToken = async (code) => {
  const { data } = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data.access_token;
};

/**
 * Get authenticated user profile
 */
exports.getAuthenticatedUser = async (token) => {
  const client = getGithubClient(token);
  const { data } = await client.get('/user');
  return data;
};

/**
 * Get user's repositories
 */
exports.getMyRepositories = async (token) => {
  const client = getGithubClient(token);
  const { data } = await client.get('/user/repos', {
    params: {
      sort: 'updated',
      direction: 'desc',
      per_page: 100,
    },
  });
  return data;
};

/**
 * Create a new repository
 */
exports.createRepository = async (token, repoData) => {
  const client = getGithubClient(token);
  const { data } = await client.post('/user/repos', {
    name: repoData.name,
    description: repoData.description,
    private: repoData.private,
    auto_init: repoData.auto_init,
  });
  return data;
};

/**
 * Get a repository
 */
exports.getRepository = async (token, owner, repo) => {
  const client = getGithubClient(token);
  const { data } = await client.get(`/repos/${owner}/${repo}`);
  return data;
};

/**
 * Get default branch reference
 */
exports.getRef = async (token, owner, repo, branch) => {
  const client = getGithubClient(token);
  const { data } = await client.get(`/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  return data;
};

/**
 * Create a blob
 */
exports.createBlob = async (token, owner, repo, content, encoding = 'base64') => {
  const client = getGithubClient(token);
  const { data } = await client.post(`/repos/${owner}/${repo}/git/blobs`, {
    content,
    encoding,
  });
  return data;
};

/**
 * Create a tree
 */
exports.createTree = async (token, owner, repo, baseTreeSha, treeItems) => {
  const client = getGithubClient(token);
  const { data } = await client.post(`/repos/${owner}/${repo}/git/trees`, {
    base_tree: baseTreeSha,
    tree: treeItems,
  });
  return data;
};

/**
 * Create a commit
 */
exports.createCommit = async (token, owner, repo, message, treeSha, parentSha) => {
  const client = getGithubClient(token);
  const { data } = await client.post(`/repos/${owner}/${repo}/git/commits`, {
    message,
    tree: treeSha,
    parents: [parentSha],
  });
  return data;
};

/**
 * Update a reference
 */
exports.updateRef = async (token, owner, repo, branch, commitSha) => {
  const client = getGithubClient(token);
  const { data } = await client.patch(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    sha: commitSha,
    force: true, // safe since it's our own commit branch, but usually true for this flow
  });
  return data;
};

/**
 * Enable GitHub Pages
 */
exports.enableGitHubPages = async (token, owner, repo, branch, path) => {
  const client = getGithubClient(token);
  const { data } = await client.post(`/repos/${owner}/${repo}/pages`, {
    source: {
      branch,
      path,
    },
  });
  return data;
};

/**
 * Get GitHub Pages status
 */
exports.getGitHubPagesStatus = async (token, owner, repo) => {
  const client = getGithubClient(token);
  const { data } = await client.get(`/repos/${owner}/${repo}/pages`);
  return data;
};
