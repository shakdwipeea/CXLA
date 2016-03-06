import express from 'express'
import fs from 'fs'
import { searchDoubleHighlight } from '../utils/new_log_search'
import { searchKeyword } from '../utils/keyword_search'
import _ from 'lodash'
import async from 'async'

var router = express.Router();

router.post('/search', (req, res) =>  {

    //uploaded File name
    const uploadedFile = req.body.file_name;

    const filePath = __dirname + "/../public/data/" + uploadedFile;

    //TODO : change hardcoded timestamp
    searchKeyword("current time is Fri Aug 28 08:45:08 2015",req.body.keywords,filePath, (searchKeyword) => {

        res.json({data: searchKeyword});
    });
});


router.post('/upload', (req, res) => {

    const oldPath = __dirname + "/../public/data/" + req.file.filename;

    const newPath = __dirname + "/../public/data/" + req.file.originalname;

    fs.rename(oldPath, newPath, (err) => {

        if (err) {

            res.json({err: err});
        }
        else {
            res.json({msg: "uploaded"});
        }
    });

});


router.post('/', (req, res) => {

    //stores one or more highlighted key,value pair
    const highlightedData = req.body.data;

    //uploaded File name
    const uploadedFileName = req.body.file_name;

    const filePath = __dirname + "/../public/data/" + uploadedFileName;

    //array of objects => {timeStamp : value}
    const dataArray = [];

    //breaking into chunks different key,value pairs
    const arrayChunk = _.chunk(highlightedData, 2);

    let k = 0;
    const m = arrayChunk.length;


    arrayChunk.forEach((arrayChunk) => {

        //TODO : change hardcoded timestamp
        searchDoubleHighlight("current time is Fri Aug 28 10:46:55 2015",arrayChunk,filePath, (arr) => {
            dataArray.push(arr);
            k++;
            complete();
        });

    });

    var complete =  () => {

        if (k === m) {
            res.json({
                data: dataArray
            });
        }
    }


});

module.exports = router;