var JSFtp = require('jsftp');

function getFiles(param, callback) {
    var Ftp = new JSFtp({
        host:param.host
    });

    Ftp.auth(param.username, param.password, function (err) {
       if (err) {
           callback({success:false});
       } else {
           Ftp.get(param.source, __dirname + '/../public/data/ftp/' + param.filename , function(hadErr) {
               if (hadErr){
                   console.error('There was an error retrieving the file.');
               callback({success:false});
           }
               else
               {
                   console.log('File copied successfully!');
                   callback({success:true});
               }
           });
       }
    });
}

module.exports = {
    getFiles:getFiles
};