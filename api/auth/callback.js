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
  const jsonData = JSON.stringify(data);
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head><title>OAuth Callback</title></head>
<body>
<pre id="debug"></pre>
<script>
(function() {
  var status = "${status}";
  var data = ${jsonData};
  var debug = document.getElementById('debug');
  
  debug.textContent = "Status: " + status + "\\nData: " + JSON.stringify(data, null, 2);
  
  if (window.opener) {
    var message = "authorization:github:" + status + ":" + JSON.stringify(data);
    debug.textContent += "\\n\\nSending message: " + message;
    debug.textContent += "\\nTo opener origin: " + window.opener.location.origin;
    
    window.opener.postMessage(message, window.opener.location.origin);
    
    debug.textContent += "\\n\\nMessage sent! Window will close in 3 seconds...";
    setTimeout(function() { window.close(); }, 3000);
  } else {
    debug.textContent += "\\n\\nERROR: No window.opener found!";
  }
})();
</script>
</body>
</html>`);
}
