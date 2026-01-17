/**
 * ZYBORN Decap CMS - GitHub OAuth Entry Point
 * 
 * This function initiates the GitHub OAuth flow for Decap CMS authentication.
 * It redirects users to GitHub's authorization page.
 * 
 * Environment Variables Required:
 * - OAUTH_GITHUB_CLIENT_ID: Your GitHub OAuth App Client ID
 */

export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ 
      error: 'OAuth not configured. Missing OAUTH_GITHUB_CLIENT_ID environment variable.' 
    });
  }
  
  // Determine the base URL for the callback
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'zyborn.com';
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/callback`;
  
  // GitHub OAuth authorization URL
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo,user');
  authUrl.searchParams.set('state', generateState());
  
  res.redirect(302, authUrl.toString());
}

/**
 * Generate a random state parameter for CSRF protection
 */
function generateState() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
