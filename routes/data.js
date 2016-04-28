var express = require('express');
var router = express.Router();
var fs = require('fs');
var searchDoubleHighlight = require('../utils/new_log_search');
var searchKeyword = require('../utils/keyword_search');
var ftpClient = require('../utils/ftpClient');
var _ = require('lodash');
var async = require('async');
var path = require('path');

const dataDirectory = '/../public/data/';

router.post('/search', (req, res) => {
  // uploaded File name
  const uploadedFile = req.body.file_name;
  const filePath = `${__dirname}${dataDirectory}${uploadedFile}`;

  const highlightedTimestamp = req.body.timeStampText;
  searchKeyword(highlightedTimestamp, req.body.keywords, filePath, (searchedKeyword) => {
    res.json({ data: searchedKeyword[0] });
  });
});

router.post('/searchEntity', (req, res) => {
  // uploaded File name
  const uploadedFile = req.body.file_name;
const filePath = `${__dirname}${dataDirectory}${uploadedFile}`;

const highlightedTimestamp = req.body.timeStampText;
searchKeyword(highlightedTimestamp, req.body.keywords, filePath, (searchedKeyword) => {
  console.log(searchedKeyword[1]);
  res.json({ data: searchedKeyword[1] });
});
});


router.post('/upload', (req, res) => {
  const oldPath = `${__dirname}${dataDirectory}${req.file.filename}`;
  const newPath = `${__dirname}${dataDirectory}${req.file.originalname}`;

  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ message: 'uploaded' });
    }
  });
});

router.post('/ftp', (req,res) => {
  ftpClient.getFiles(req.body, (err) => {
  if(!err.success) {
    res.status(404).json({error:err.msg});
  }
  else {
    var filename = req.body.source.split('/');
    res.sendFile(path.join(__dirname, '../public/data/ftp', filename[filename.length-1]));
  }
})
});

router.post('/', (req, res) => {
  // stores one or more highlighted key,value pair
  const highlightedData = req.body.data;
  //console.log(highlightedData);
  // uploaded File name
  const uploadedFileName = req.body.file_name;

  const filePath = `${__dirname}${dataDirectory}${uploadedFileName}`;

  // array of objects => {timeStamp : value}
  const dataArray = [];

  // breaking into chunks different key,value pairs
  const arrayChunk = _.chunk(highlightedData, 3);

  const timeStampText = req.body.timeStampText;
  console.log("The timestamp Text is", timeStampText);


  async.forEachOf(arrayChunk, (arr, val, callback) => {
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
