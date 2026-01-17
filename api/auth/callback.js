/**
 * ZYBORN Decap CMS - GitHub OAuth Callback Handler
 * 
 * This function handles the OAuth callback from GitHub.
 * It exchanges the authorization code for an access token
 * and posts the result back to the Decap CMS window.
 * 
 * Environment Variables Required:
 * - OAUTH_GITHUB_CLIENT_ID: Your GitHub OAuth App Client ID
 * - OAUTH_GITHUB_CLIENT_SECRET: Your GitHub OAuth App Client Secret
 */

export default async function handler(req, res) {
  const { code, state, error, error_description } = req.query;
  
  // Handle OAuth errors
  if (error) {
    return sendResponse(res, 'error', {
      error: error,
      error_description: error_description || 'Unknown error occurred'
    });
  }
  
  // Validate authorization code
  if (!code) {
    return sendResponse(res, 'error', {
      error: 'missing_code',
      error_description: 'No authorization code received from GitHub'
    });
  }
  
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  
  // Validate environment variables
  if (!clientId || !clientSecret) {
    return sendResponse(res, 'error', {
      error: 'config_error',
      error_description: 'OAuth credentials not configured on server'
    });
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
      return sendResponse(res, 'error', {
        error: tokenData.error,
        error_description: tokenData.error_description || 'Failed to get access token'
      });
    }
    
    // Success - send token back to Decap CMS
    return sendResponse(res, 'success', {
      token: tokenData.access_token,
      provider: 'github'
    });
    
  } catch (err) {
    console.error('OAuth callback error:', err);
    return sendResponse(res, 'error', {
      error: 'server_error',
      error_description: 'Failed to complete authentication'
    });
  }
}

/**
 * Send response back to Decap CMS via postMessage
 */
function sendResponse(res, status, data) {
  const content = {
    token: data.token,
    provider: data.provider,
    error: data.error,
    errorDescription: data.error_description
  };
  
  const script = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>OAuth Callback</title>
    </head>
    <body>
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage %o", e);
            window.opener.postMessage(
              'authorization:github:${status}:${JSON.stringify(content)}',
              e.origin
            );
            window.removeEventListener("message", receiveMessage, false);
          }
          window.addEventListener("message", receiveMessage, false);
          
          console.log("Sending message to opener");
          window.opener.postMessage("authorizing:github", "*");
        })();
      </script>
      <p>Completing authentication...</p>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(script);
}
