const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 3000;

app.use('/proxy', (req, res) => {
  const targetURL = decodeURIComponent(req.url.replace('/proxy/', ''));
  console.log('Target URL:', targetURL);

  // Proxy the request to the target server
  proxy.web(req, res, { target: targetURL }, (err) => {
    console.error('Proxy Error:', err);
    res.status(500).send('Internal Server Error');
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
