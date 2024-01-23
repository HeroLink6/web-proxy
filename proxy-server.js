const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

// Set up proxy middleware
const proxyMiddleware = createProxyMiddleware({
  changeOrigin: true,
});

app.use('/proxy', (req, res) => {
  const targetURL = req.query.url;

  if (!targetURL) {
    return res.status(400).send('Target URL not provided');
  }

  try {
    // Update the proxy middleware target dynamically
    proxyMiddleware.target = targetURL;

    // Use the proxy middleware to forward the request
    proxyMiddleware(req, res, (err) => {
      if (err) {
        console.error('Proxy Error:', err);
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});

