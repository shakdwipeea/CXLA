var assert = require('chai').assert;
var log_search = require('../utils/log_search');

var filePath = "/home/akash/Documents/log1.txt";


describe('logSearchDoubleHighlight', function () {
    describe('time_stamp', function () {
        it('should match with original results from log file', function (done) {
            var iter = 0;

            assert.doesNotThrow(function () {
                var time_stamp = [];
                var value_corres = [];
                log_search.logAnalyser(["S(100.100.12.9:80", "Hits("], filePath, function (res) {
                    Object.keys(res).forEach(function (key) {
                        time_stamp.push(key);
                        value_corres.push(res[key]);
                    });
                    assert.equal(time_stamp[0], "Fri Aug 28 08:45:08 2015");
                    assert.equal(time_stamp[1], "Fri Aug 28 08:45:15 2015");
                    assert.equal(value_corres[0], "10");
                    assert.equal(value_corres[1], "0");
                    time_stamp = [];
                    value_corres = [];
                    iter++;
                    complete();
                });

                log_search.logAnalyser(["S(100.100.12.10:80", "Hits("], filePath, function (res) {
                    Object.keys(res).forEach(function (key) {
                        time_stamp.push(key);
                        value_corres.push(res[key]);
                    });
                    assert.equal(time_stamp[0], "Fri Aug 28 08:45:08 2015");
                    assert.equal(time_stamp[1], "Fri Aug 28 08:45:15 2015");
                    assert.equal(value_corres[0], "0");
                    assert.equal(value_corres[1], "5");
                    time_stamp = [];
                    value_corres = [];
                    iter++;
                    complete();
                });

                log_search.logAnalyser(["S(100.100.12.8:80:", "Hits("], filePath, function (res) {
                    Object.keys(res).forEach(function (key) {
                        time_stamp.push(key);
                        value_corres.push(res[key]);
                    });
                    assert.equal(time_stamp[0], "Fri Aug 28 08:45:08 2015");
                    assert.equal(time_stamp[1], "Fri Aug 28 08:45:15 2015");
                    assert.equal(value_corres[0], "0");
                    assert.equal(value_corres[1], "0");
                    time_stamp = [];
                    value_corres = [];
                    iter++;
                    complete();
                });

                function complete() {
                    if (iter == 3) {
                        done();
                    }
                }
            });
        });

        /*it('should match with original results from log file', function (done) {
            assert.doesNotThrow(function () {
                var time_stamp = [];
                var value_corres = [];
                log_search.logAnalyser(["S(100.100.12.10:80", "Mbps"], filePath, function (res) {
                    Object.keys(res).forEach(function (key) {
                        time_stamp.push(key);
                        value_corres.push(res[key]);
                    });
                    assert.equal(time_stamp[0], "Fri Aug 28 08:45:08 2015");
                    assert.equal(time_stamp[1], "Fri Aug 28 08:45:15 2015");
                    assert.equal(value_corres[0], "90");
                    assert.equal(value_corres[1], "0");

                    done();
                }, function (err) {
                    if (err) throw err;
                    done();
                });
            });
        });*/
    });
});
