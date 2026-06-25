/**
 * GitHub REST API Service
 * Handles all GitHub API calls with error handling and rate limiting.
 */

const BASE_URL = 'https://api.github.com';

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint (e.g., '/users/torvalds')
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} Parsed JSON response
 */
async function githubFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const headers = {
    Accept: 'application/vnd.github.v3+json',
    ...options.headers,
  };

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    if (response.status === 403 && errorData.message?.includes('rate limit')) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    if (response.status === 404) {
      throw new Error('Resource not found.');
    }
    if (response.status === 422) {
      throw new Error('Invalid search query.');
    }

    throw new Error(errorData.message || `GitHub API error: ${response.status}`);
  }

  return response.json();
}

// =============================================
// USER ENDPOINTS
// =============================================

/**
 * Get a single GitHub user by username.
 * @param {string} username
 * @returns {Promise<Object>} User data
 */
export async function getUser(username) {
  return githubFetch(`/users/${encodeURIComponent(username)}`);
}

/**
 * Search GitHub users by query.
 * @param {string} query - Search query
 * @param {number} page - Page number (default 1)
 * @param {number} perPage - Results per page (default 20)
 * @returns {Promise<Object>} { total_count, items }
 */
export async function searchUsers(query, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    per_page: perPage.toString(),
  });
  return githubFetch(`/search/users?${params}`);
}

/**
 * Get a user's public repositories.
 * @param {string} username
 * @param {number} page
 * @param {number} perPage
 * @param {string} sort - 'updated', 'stars', 'full_name'
 * @returns {Promise<Array>} Array of repository objects
 */
export async function getUserRepos(username, page = 1, perPage = 20, sort = 'updated') {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    sort,
    direction: 'desc',
  });
  return githubFetch(`/users/${encodeURIComponent(username)}/repos?${params}`);
}

/**
 * Get a user's followers.
 * @param {string} username
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Array>} Array of user objects
 */
export async function getUserFollowers(username, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  return githubFetch(`/users/${encodeURIComponent(username)}/followers?${params}`);
}

/**
 * Get users that a user is following.
 * @param {string} username
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Array>} Array of user objects
 */
export async function getUserFollowing(username, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  return githubFetch(`/users/${encodeURIComponent(username)}/following?${params}`);
}

// =============================================
// REPOSITORY ENDPOINTS
// =============================================

/**
 * Get a single repository.
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<Object>} Repository data
 */
export async function getRepo(owner, repo) {
  return githubFetch(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
}

/**
 * Search repositories with filters.
 * @param {Object} filters - { query, language, stars, forks, sort }
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Object>} { total_count, items }
 */
export async function searchRepos(filters = {}, page = 1, perPage = 20) {
  let q = filters.query || '';

  if (filters.language) {
    q += ` language:${filters.language}`;
  }
  if (filters.stars) {
    q += ` stars:>=${filters.stars}`;
  }
  if (filters.forks) {
    q += ` forks:>=${filters.forks}`;
  }

  const params = new URLSearchParams({
    q: q.trim() || 'stars:>1000',
    page: page.toString(),
    per_page: perPage.toString(),
    sort: filters.sort || 'stars',
    order: 'desc',
  });

  return githubFetch(`/search/repositories?${params}`);
}

/**
 * Get repository contributors.
 * @param {string} owner
 * @param {string} repo
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Array>}
 */
export async function getRepoContributors(owner, repo, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contributors?${params}`
  );
}

/**
 * Get repository issues.
 * @param {string} owner
 * @param {string} repo
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Array>}
 */
export async function getRepoIssues(owner, repo, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    state: 'open',
    sort: 'updated',
    direction: 'desc',
  });
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?${params}`
  );
}

/**
 * Get repository branches.
 * @param {string} owner
 * @param {string} repo
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Array>}
 */
export async function getRepoBranches(owner, repo, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches?${params}`
  );
}

/**
 * Get repository commits.
 * @param {string} owner
 * @param {string} repo
 * @param {number} page
 * @param {number} perPage
 * @returns {Promise<Array>}
 */
export async function getRepoCommits(owner, repo, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  return githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?${params}`
  );
}
