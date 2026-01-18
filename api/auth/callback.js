/**
 * ZYBORN Decap CMS - GitHub OAuth Callback Handler
 * Safari-compatible version with extended handshake
 */

export default async function handler(req, res) {
  const { code, error, error_description } = req.query;
  
  if (error) {
    return sendResult(res, 'error', { error, error_description });
  }
  
  if (!code) {
    return sendResult(res, 'error', { error: 'missing_code', error_description: 'No code received' });
  }
  
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return sendResult(res, 'error', { error: 'config_error', error_description: 'OAuth not configured' });
  }
  
  try {
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
      return sendResult(res, 'error', { 
        error: tokenData.error, 
        error_description: tokenData.error_description 
      });
    }
    
    return sendResult(res, 'success', { 
      token: tokenData.access_token,
      provider: 'github'
    });
    
  } catch (err) {
    console.error('OAuth error:', err);
    return sendResult(res, 'error', { error: 'server_error', error_description: err.message });
  }
}

function sendResult(res, status, data) {
  const token = data.token || '';
  const error = data.error || '';
  const errorDesc = data.error_description || '';
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <title>OAuth Callback</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<p id="status">Completing authentication...</p>
<script>
(function() {
  const status = "${status}";
  const token = "${token}";
  const error = "${error}";
  const errorDesc = "${errorDesc}";
  const statusEl = document.getElementById('status');
  
  let messageSent = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  function buildMessage() {
    if (status === 'success') {
      return 'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' });
    } else {
      return 'authorization:github:error:' + JSON.stringify({ error: error, error_description: errorDesc });
    }
  }
  
  function sendAuthMessage() {
    if (!window.opener) {
      statusEl.textContent = 'Error: Lost connection to parent window';
      return;
    }
    
    const message = buildMessage();
    
    try {
      window.opener.postMessage(message, '*');
    } catch(e) {
      console.error('postMessage failed:', e);
    }
    
    messageSent = true;
    statusEl.textContent = 'Authentication complete!';
    
    setTimeout(function() { 
      try { window.close(); } catch(e) {}
    }, 1500);
  }
  
  function handleMessage(e) {
    if (e.data === 'authorizing:github' && !messageSent) {
      window.removeEventListener('message', handleMessage);
      sendAuthMessage();
    }
  }
  
  window.addEventListener('message', handleMessage);
  
  // Safari fix: retry mechanism
  function tryDirectSend() {
    if (messageSent || attempts >= maxAttempts) return;
    attempts++;
    
    if (window.opener) {
      statusEl.textContent = 'Connecting... (attempt ' + attempts + ')';
      
      try {
        window.opener.postMessage('authorizing:github', '*');
      } catch(e) {}
      
      // After 3 attempts, send token directly (Safari fallback)
      if (attempts >= 3) {
        sendAuthMessage();
      }
    }
    
    if (!messageSent) {
      setTimeout(tryDirectSend, 500);
    }
  }
  
  if (window.opener) {
    tryDirectSend();
  } else {
    statusEl.textContent = 'Error: No parent window. Please try again.';
  }
})();
</script>
</body>
</html>`);
}
