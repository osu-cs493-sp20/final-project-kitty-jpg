require('dotenv').config()
const express = require('express');
const { optionalAuthentication } = require('./lib/auth')

const api = require('./api');

const app = express();
const port = process.env.PORT || 8000;

app.use(optionalAuthentication);
app.use(express.json());


app.use('/', api);

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

app.listen(port, function() {
  console.log("== Server is running on port", port);
});