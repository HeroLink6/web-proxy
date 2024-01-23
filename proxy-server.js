const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

const PORT = 3000;

app.use(express.static('public'));

app.use('/proxy', async (req, res) => {
  const targetURL = req.query.url;

  if (!targetURL) {
    return res.status(400).send('Target URL not provided');
  }

  try {
    // Make a request to the target website
    const response = await axios.get(targetURL);

    // Send the modified HTML back to the client
    res.send(response.data);
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


