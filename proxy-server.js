const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 3000;

app.use('/proxy', (req, res) => {
  const targetURL = decodeURIComponent(req.url.replace('/proxy/', ''));
  proxy.web(req, res, { target: targetURL });
});

  // Proxy the request to the dynamically constructed target URL
  proxy.web(req, res, { target: targetURL });
});

// Handle redirects
proxy.on('proxyRes', (proxyRes, req, res) => {
  if (proxyRes.headers['location']) {
    const redirectUrl = proxyRes.headers['location'];
    res.header('location', redirectUrl);
    res.sendStatus(302); // Redirect status code
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
