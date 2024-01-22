const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 3000;

// Set up proxy middleware
const proxyMiddleware = createProxyMiddleware({
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '', // Remove the '/proxy' prefix
  },
});

// Use the proxy middleware
app.use('/proxy', (req, res) => {
  const targetURL = req.query.url;

  if (!targetURL) {
    return res.status(400).send('Target URL not provided');
  }

  proxyMiddleware({
    target: targetURL,
  })(req, res);
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
