const express = require('express');
const puppeteer = require('puppeteer');
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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the target website
    const navigationResponse = await page.goto(targetURL);
    
    // Log the status of the navigation
    console.log('Navigation Status:', navigationResponse.status());

    // Extract the modified HTML using evaluate
    const modifiedHTML = await page.evaluate(() => document.documentElement.outerHTML);

    // Log the modified HTML
    console.log('Modified HTML:', modifiedHTML);

    // Send the modified HTML back to the client
    res.send(modifiedHTML);

    await browser.close();
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
