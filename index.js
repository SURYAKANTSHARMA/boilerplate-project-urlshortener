require('dotenv').config();
const express = require('express');
const validUrl = require('valid-url');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.json()); // Parse JSON in the request body
app.use(bodyParser.urlencoded({extented: true}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
const urlMapping = {};
const counter = 0;
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

function validateUrl(req, res, next) {
  // const url = req.body && req.body.url;
  const { url } = req.body;

  if (!url || !validUrl.isWebUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  
  // Create a new variable to store the validated URL
  const validatedUrl = url;
  
  dns.lookup(validatedUrl, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    next();
  });
  

}
// Your first API endpoint
app.post('/api/shorturl',
 validateUrl,
 function(req, res) {
  const url = req.body.url;
  const shortUrl = ++counter; // Increment counter for each new URL
  userMapping[counter] = url  
  res.json({ original_url: url, short_url: shortUrl });
});

app.get('/api/shorturl/:id',
  function(req, res) {
    const id = parseInt(req.params.id);
    if (userMapping[id]) {
      res.redirect(userMapping[id])
    } else {
      res.status(404).json({error: 'Short URL not found'})
    }
 });

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
