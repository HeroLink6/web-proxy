const express = require('express');
const httpProxy = require('http-proxy');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 3000;

app.use('/proxy', async (req, res) => {
  const targetURL = decodeURIComponent(req.url.replace('/proxy/', ''));
  console.log('Target URL:', targetURL);

  try {
    // Fetch the HTML content from the target website
    const { data } = await axios.get(targetURL);

    // Modify the HTML using Cheerio or any other HTML manipulation library
    const $ = cheerio.load(data);

    // Example: Add a div with a custom message to the body
    $('body').append('<div>This content was modified by the proxy server!</div>');

    // Send the modified HTML back to the client
    res.send($.html());
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
