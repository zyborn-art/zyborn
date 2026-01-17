/**
 * ZYBORN Decap CMS - GitHub OAuth Callback Handler
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
  // Escape for embedding in script
  const escapedData = JSON.stringify(data).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head><title>OAuth Callback</title></head>
<body>
<script>
(function() {
  var data = JSON.parse('${escapedData}');
  var message = "authorization:github:${status}:" + JSON.stringify(data);
  
  console.log("Decap OAuth: Sending message", message);
  
  if (window.opener) {
    // Try multiple approaches
    window.opener.postMessage(message, "*");
    
    setTimeout(function() { 
      window.close(); 
    }, 1000);
  }
})();
</script>
<p>Authentication complete. This window should close automatically.</p>
</body>
</html>`);
}
