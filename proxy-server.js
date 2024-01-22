const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

const PORT = 3000;

app.use(express.static('public'));

app.use('/proxy', async (req, res) => {
  const targetURL = req.query.url;

  if (!targetURL) {
    return res.status(400).send('Target URL not provided');
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the target website
    await page.goto(targetURL);

    // Extract and send the modified HTML back to the client
    const content = await page.content();
    res.send(content);

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
