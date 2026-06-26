const githubService = require('../services/githubService');

exports.getMyRepos = async (req, res) => {
  try {
    const repos = await githubService.getMyRepositories(req.session.githubToken);
    res.json({ success: true, repos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRepo = async (req, res) => {
  try {
    const repo = await githubService.createRepository(req.session.githubToken, req.body);
    res.json({ success: true, repo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadFiles = async (req, res) => {
  const { owner, repo } = req.params;
  const token = req.session.githubToken;
  const files = req.files; // from multer

  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, message: 'No files provided' });
  }

  try {
    // 1. Get the current commit SHA of the default branch
    const repoData = await githubService.getRepository(token, owner, repo);
    const branch = repoData.default_branch;
    const refData = await githubService.getRef(token, owner, repo, branch);
    const commitSha = refData.object.sha;

    // 2. Get the tree SHA for the commit
    const commitData = (await getGithubClient(token).get(`/repos/${owner}/${repo}/git/commits/${commitSha}`)).data;
    const baseTreeSha = commitData.tree.sha;

    // 3. Create Blobs for all files and build tree items
    const treeItems = [];
    for (const file of files) {
      // file.originalname can include path if uploaded with webkitdirectory
      const content = file.buffer.toString('base64');
      const blob = await githubService.createBlob(token, owner, repo, content, 'base64');
      
      treeItems.push({
        path: file.originalname,
        mode: '100644', // file (blob)
        type: 'blob',
        sha: blob.sha,
      });
    }

    // 4. Create a new Tree
    const newTree = await githubService.createTree(token, owner, repo, baseTreeSha, treeItems);

    // 5. Create a new Commit
    const message = 'Upload project files from GitHub Workspace';
    const newCommit = await githubService.createCommit(token, owner, repo, message, newTree.sha, commitSha);

    // 6. Update the Branch Reference
    await githubService.updateRef(token, owner, repo, branch, newCommit.sha);

    res.json({ success: true, message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Upload Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper for inline client (to avoid duplicate code)
const axios = require('axios');
const getGithubClient = (token) => {
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
};

exports.enablePages = async (req, res) => {
  const { owner, repo } = req.params;
  const { branch, path } = req.body;
  
  try {
    const pages = await githubService.enableGitHubPages(req.session.githubToken, owner, repo, branch, path);
    res.json({ success: true, pages });
  } catch (error) {
    // 409 means pages is already enabled
    if (error.response && error.response.status === 409) {
      return res.json({ success: true, message: 'GitHub Pages is already enabled' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPagesStatus = async (req, res) => {
  const { owner, repo } = req.params;
  
  try {
    const status = await githubService.getGitHubPagesStatus(req.session.githubToken, owner, repo);
    res.json({ success: true, status });
  } catch (error) {
    // 404 means not enabled yet
    if (error.response && error.response.status === 404) {
      return res.json({ success: true, status: null });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
