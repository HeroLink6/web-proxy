const express = require('express');
const httpProxy = require('http-proxy');
const cheerio = require('cheerio');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 3000;

app.use('/proxy', (req, res) => {
  const targetURL = decodeURIComponent(req.url.replace('/proxy/', ''));
  console.log('Target URL:', targetURL);

  // Proxy the request to the target server
  proxy.web(req, res, { target: targetURL });

  // Intercept the response and modify the HTML before sending it back
  proxy.on('proxyRes', (proxyRes, req, res) => {
    let body = '';
    proxyRes.on('data', (chunk) => {
      body += chunk;
    });

    proxyRes.on('end', () => {
      // Modify the HTML using Cheerio or any other HTML manipulation library
      const $ = cheerio.load(body);

      // Example: Add a meta tag to the head
      $('head').append('<meta name="my-custom-meta" content="some content">');

      // Send the modified HTML back to the client
      res.send($.html());
    });
  });
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
