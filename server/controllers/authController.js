const githubService = require('../services/githubService');

exports.githubAuth = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;
  // We need repo, user scopes
  const scope = 'user repo';
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
  
  res.redirect(githubAuthUrl);
};

exports.githubCallback = async (req, res) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173/github-workspace';

  if (!code) {
    return res.redirect(`${frontendUrl}/#/login?error=no_code`);
  }

  try {
    const token = await githubService.exchangeCodeForToken(code);
    // Store token in session
    req.session.githubToken = token;
    
    // Redirect to frontend dashboard or profile
    res.redirect(`${frontendUrl}/#/dashboard?login=success`);
  } catch (error) {
    console.error('OAuth Callback Error:', error.message);
    res.redirect(`${frontendUrl}/#/login?error=auth_failed`);
  }
};

exports.getMe = async (req, res) => {
  try {
    // Requires authMiddleware to ensure token exists
    const token = req.session.githubToken;
    const user = await githubService.getAuthenticatedUser(token);
    
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get Me Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // default express-session cookie name
    res.json({ success: true, message: 'Logged out successfully' });
  });
};
