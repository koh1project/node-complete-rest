//@ts-check
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const feedRoutes = require('./routes/feed');


const app = express();



const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images');
  },
  filename: function(req, file, cb) {
    cb(null, uuidv4())
  }
});

/**@param {Express.Multer.File} file @param {multer.FileFilterCallback} cb*/
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);



/**@type {ErrorHandler} */
const errorHandler = (error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;

  res.status(status).json({ message: message });

};

app.use(errorHandler);

mongoose.connect('mongodb+srv://node:1234abcd@cluster0.nwkss.mongodb.net/myFirstDatabase')
  .then(result => {
    console.log('Database connected');
    app.listen(8080);
  }).catch(err => { console.log(err); });

/**
 * @typedef {(error: Error &  {statusCode: number;}, req: Express.Request, res: any, next: import('express').NextFunction) => void} ErrorHandler
 */