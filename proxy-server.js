const express = require('express');
const httpProxy = require('http-proxy');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 3000;

// Serve HTML with a search bar
app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public/index.html');
});

// Handle form submissions
app.post('/search', (req, res) => {
  const query = req.body.query; // Assuming you have a body-parser middleware for parsing POST data

  // Proxy the request to the destination server
  proxy.web(req, res, { target: `https://google.com/search?q=${query}` });
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
