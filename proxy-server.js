const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 3000;

// Serve HTML with a search bar
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submissions
app.post('/search', (req, res) => {
  const query = req.body.query; // Assuming you have a body-parser middleware for parsing POST data

  // Use the user's input to construct the target URL
  const targetURL = `https://web-proxy-delta.vercel.app/${query}`;

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

