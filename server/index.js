const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
require('dotenv').config()
const api = require('./api')
require('./db')
const app = express()

// add middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use('/api/v1', api)

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// start express server on port 5000
app.listen(5000, () => {
  console.log("server started on port 5000");
});
