import express from 'express';
import fs from 'fs';
import { searchDoubleHighlight } from '../utils/new_log_search';
import { searchKeyword } from '../utils/keyword_search';
import _ from 'lodash';
import async from 'async';

const dataDirectory = '/../public/data/';
const router = express.Router();


router.post('/search', (req, res) => {
  // uploaded File name
  const uploadedFile = req.body.file_name;
  const filePath = `${__dirname}${dataDirectory}${uploadedFile}`;

  const highlightedTimestamp = req.body.timeStampText;
  // TODO : change hardcoded timestamp
  searchKeyword(highlightedTimestamp, req.body.keywords, filePath, (searchedKeyword) => {
    res.json({ data: searchedKeyword });
  });
});


router.post('/upload', (req, res) => {
  const oldPath = `${__dirname}${dataDirectory}${req.file.filename}`;
  const newPath = `${__dirname}${dataDirectory}${req.file.originalname}`;

  console.log('Paths', oldPath, newPath)

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ message: 'uploaded' });
    }
  });
});


router.post('/', (req, res) => {
  // stores one or more highlighted key,value pair
  const highlightedData = req.body.data;

  // uploaded File name
  const uploadedFileName = req.body.file_name;

  const filePath = `${__dirname}${dataDirectory}${uploadedFileName}`;

  // array of objects => {timeStamp : value}
  const dataArray = [];

  // breaking into chunks different key,value pairs
  const arrayChunk = _.chunk(highlightedData, 2);

  const timeStampText = req.body.timeStampText;
  console.log("The timestamp Text is", timeStampText);


  async.forEachOf(arrayChunk, (arr, val, callback) => {
        // TODO : change hardcoded timestamp
    searchDoubleHighlight(timeStampText, arr, filePath, (err, ar) => {
      if (err) {
        callback(err);
      } else {
        dataArray.push(ar);
      }
      callback();
    });
  }, (err) => {
    if (err) {
      res.json({ error: err });
    }
    res.json({ data: dataArray });
  });
});

module.exports = router;
