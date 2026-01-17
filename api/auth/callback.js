/**
 * ZYBORN Decap CMS - GitHub OAuth Callback Handler
 * 
 * Environment Variables Required:
 * - OAUTH_GITHUB_CLIENT_ID: Your GitHub OAuth App Client ID
 * - OAUTH_GITHUB_CLIENT_SECRET: Your GitHub OAuth App Client Secret
 */

export default async function handler(req, res) {
  const { code, error, error_description } = req.query;
  
  // Handle OAuth errors from GitHub
  if (error) {
    return sendError(res, error, error_description || 'Authorization failed');
  }
  
  if (!code) {
    return sendError(res, 'missing_code', 'No authorization code received');
  }
  
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return sendError(res, 'config_error', 'OAuth not configured on server');
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      return sendError(res, tokenData.error, tokenData.error_description || 'Token exchange failed');
    }
    
    // Success - send token back to Decap CMS
    return sendSuccess(res, tokenData.access_token);
    
  } catch (err) {
    console.error('OAuth callback error:', err);
    return sendError(res, 'server_error', 'Authentication request failed');
  }
}

function sendSuccess(res, token) {
  const message = JSON.stringify({
    token: token,
    provider: 'github'
  });
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Authorization Complete</title></head>
<body>
<script>
  (function() {
    var message = 'authorization:github:success:${message}';
    if (window.opener) {
      window.opener.postMessage(message, '*');
      setTimeout(function() { window.close(); }, 500);
    } else {
      document.body.innerHTML = '<p>Authorization successful. You can close this window.</p>';
    }
  })();
</script>
<p>Completing authentication...</p>
</body>
</html>
  `);
}

function sendError(res, error, description) {
  const message = JSON.stringify({
    error: error,
    error_description: description
  });
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
<!DOCTYPE html>
<html>
<head><title>Authorization Failed</title></head>
<body>
<script>
  (function() {
    var message = 'authorization:github:error:${message}';
    if (window.opener) {
      window.opener.postMessage(message, '*');
      setTimeout(function() { window.close(); }, 1000);
    }
  })();
</script>
<p>Error: ${description}</p>
<p>You can close this window.</p>
</body>
</html>
  `);
}
