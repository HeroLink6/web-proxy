const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/proxy', (req, res) => {
  const targetURL = req.query.url;
  console.log('Requested URL:', targetURL);

  if (!targetURL) {
    return res.status(400).send('Target URL not provided');
  }

  const client = targetURL.startsWith('https') ? https : http;

  // Make a request to the target website
  const proxyRequest = client.get(targetURL, (proxyRes) => {
    let data = '';

    proxyRes.on('data', (chunk) => {
      data += chunk;
    });

    proxyRes.on('end', () => {
      // Send the received data back to the client
      res.send(data);
    });
  });

  proxyRequest.on('error', (error) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });

  proxyRequest.end();
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});

