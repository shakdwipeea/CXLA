var express = require('express');
var router = express.Router();

var parser = require('../utils/parser');


router.post('/',function(req,res,next){
    var clines = req.body.lines;

    parser.getChunks(clines,function(err,data){
        if(err){
            res.json({msg:"SOME ERROR"});
        }
        else{
            res.json({data:data});
        }
    });

});

module.exports = router;