/**
 * ZYBORN Decap CMS - GitHub OAuth Callback Handler
 * Uses the handshake pattern that Decap CMS expects
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
<head><title>OAuth Callback</title></head>
<body>
<p id="status">Completing authentication...</p>
<script>
(function() {
  const status = "${status}";
  const token = "${token}";
  const error = "${error}";
  const errorDesc = "${errorDesc}";
  const statusEl = document.getElementById('status');
  
  // Decap CMS handshake: wait for parent to ask for credentials
  function handleMessage(e) {
    console.log('Popup received:', e.data);
    
    if (e.data === 'authorizing:github') {
      // Parent is ready, send the auth result
      window.removeEventListener('message', handleMessage);
      
      let message;
      if (status === 'success') {
        message = 'authorization:github:success:' + JSON.stringify({ token: token, provider: 'github' });
      } else {
        message = 'authorization:github:error:' + JSON.stringify({ error: error, error_description: errorDesc });
      }
      
      console.log('Popup sending:', message);
      e.source.postMessage(message, e.origin);
      
      statusEl.textContent = 'Authentication complete!';
      setTimeout(function() { window.close(); }, 500);
    }
  }
  
  window.addEventListener('message', handleMessage);
  
  // Also tell parent we're ready (triggers the handshake)
  if (window.opener) {
    statusEl.textContent = 'Waiting for CMS...';
    window.opener.postMessage('authorizing:github', '*');
  } else {
    statusEl.textContent = 'Error: No parent window found';
  }
})();
</script>
</body>
</html>`);
}
