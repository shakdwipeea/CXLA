var http = require('http');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');



var fetchValues = function(res, cb) {
    res.setHeader('Content-Type', 'application/json');
    var instream = fs.createReadStream("./utils/testFile.txt", function (err) {
        console.log(err);
    });
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);


    var bound = [];
    var dem = [];
    var lines = [];
    var log_full = [];
    rl.on('line', function (line) {
        var regex = /([A-Z]{1}[a-z]{2})\s([A-Z]{1}[a-z]{2})\s([0-9]{1,2})\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)\s([0-9]{4})/;
        //var regex = /([A-Z]{1}[a-z]{2})?\s?([A-Z]{1}[a-z]{2})?\s?([0-9]{1,2})?\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)?\s([0-9]{4})?/;
        var result = regex.exec(line);
        bound.push(result);
        lines.push(line);

    });

    rl.on('close', function () {
        s = 0;
        for (var i = 0; i < bound.length; i++) {
            if (bound[i] != null) {
                dem.push(i + 1);
            }
        }
        console.log(dem);
        for (var j = 0; j < dem.length; j += 2) {
            var log_div = [];
            for (var i = dem[j] - 2; i <= dem[j + 1]; i++) {
                log_div.push(lines[i + 1]);
                //console.log(lines[i + 1]);
            }
            log_full.push(log_div);
        }
        // console.log(log_full);
        var time_axis = [];
        var x = {};
        for (var j = 0; j < 2; j++) {
            var regex = /([A-Z]{1}[a-z]{2})\s([A-Z]{1}[a-z]{2})\s([0-9]{1,2})\s(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)\s([0-9]{4})/;
            var result = regex.exec(log_full[j][0]);
            time_axis.push(result[0]);
        }
        for (var i = 0; i < log_full.length; i++) {
            var m = [];
            var ip = [];
            for (var j = 0; j < log_full[i].length; j++) {
                var v_p = {};
                var regex = /\b([A-Z]{3})\((?:[0-9]{1,3}\.){3}[0-9]{1,3}\:([0-9]{1,2})\b/
                var regexh = /\b([A-Z]{1}[a-z]{3})\([0-9]{1,2}\,\s[0-9]{1,2}\b/
                var resulth = regexh.exec(log_full[i][j]);
                var result = regex.exec(log_full[i][j]);
                if (result != null && resulth != null) {
                    v_p[result[0].slice(4, result[0].length)] = resulth[0].slice(8, resulth[0].length);
                    m.push(resulth[0].slice(8, resulth[0].length));
                    ip.push(result[0].slice(4, result[0].length));
                }
            }
            x[time_axis[i]] = m;
        }

        var data = {
            r: x,
            ip:ip
        };

        cb(data);
    });

};


module.exports = fetchValues;