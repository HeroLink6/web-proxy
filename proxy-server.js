const express = require('express');
const httpProxy = require('http-proxy');
const axios = require('axios');

const app = express();
const proxy = httpProxy.createProxyServer();

const PORT = 3000;

app.use('/proxy', async (req, res) => {
  const targetURL = decodeURIComponent(req.url.replace('/proxy/', ''));
  console.log('Target URL:', targetURL);

  try {
    // Fetch the HTML content from the target website
    const { data } = await axios.get(targetURL);

    // Send the fetched HTML content back to the client
    res.send(data);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});

