//Sean Spink
require('dotenv').config()
const express = require('express');
const { connectToDB } = require("./lib/mongo");
const { optionalAuthentication } = require('./lib/auth')
const { getDownloadStreamByFilename } = require('./models/submission')
const app = express();
const port = process.env.PORT || 8000;

app.use(optionalAuthentication);
app.use(express.json());


connectToDB(async () => {
  exports.upload = require("./lib/multer").initializeMulter();
  const api = require("./api");
  app.use("/", api);

  app.get('/download/submissions/:filename', (req, res, next) => {
    getDownloadStreamByFilename(req.params.filename)
    .on('file', (file) => {
      res.status(200).type(file.contentType);
    })
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        next();
      } else {
        next(err);
      }
    })
    .pipe(res); 
  });

  app.use("*", (err, req, res, next) => {
    console.error(err);
    res.status(500).send({
      err: "An error occurred. Try again later.",
    });
  });

  app.use('*', function (req, res, next) {
    res.status(404).json({
      error: "Requested resource " + req.originalUrl + " does not exist"
    });
  });

  app.listen(port, function() {
    console.log("== Server is running on port", port);
  });
});