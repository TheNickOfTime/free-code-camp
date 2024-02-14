require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const dns = require('dns');
const validURL = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;


// Mongo setup
mongoose.connect(process.env.MONGO_URI);
const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  }
});
let URL = new mongoose.model('URL', urlSchema);


// Mongo funcs
const saveURL = async (url) => {
  let newURL = new URL({
    url: url
  });
  let result = await newURL.save();
  return result
};

const getURL = async (url) => {
  let query = URL.findOne({url: url});
  let result = await query.exec();
  return result;
};

const getShort = async (id) => {
  let query = URL.findOne({_id: id});
  let result = await query.exec();
  return result
};


// Routes setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');v
});


// Custom routes
app.post('/api/shorturl', async (req, res) => {
  const regex = /^(http)(s)?(:\/\/)([a-z0-9.]+)(\.)([a-z]+)(\/)?$/;
  const postedURL = req.body.url;

  if (validURL.isWebUri(postedURL)) {
    let existingURL = await getURL(postedURL);
    
    if (!existingURL) {
      existingURL = await saveURL(postedURL);
    }

    res.json({
      original_url: postedURL,
      short_url: existingURL._id,
    });
  } else {
    res.json({
      error: 'invalid url'
    });
  }
});

app.get('/api/shorturl/:id?', async (req, res) => {
  if (mongoose.isValidObjectId(req.params.id)) {
    const existingURL = await getShort(req.params.id);
    if (!existingURL) {
      res.json({
        error: 'invalid url'
      });
    } else {
      res.redirect(existingURL.url);
    }
  } else {
    res.json({
      error: 'invalid url'
    });
  }
});


// Server start
app.listen(port, function() {
  console.log(`Listening on at http://localhost:${port}`);
});
