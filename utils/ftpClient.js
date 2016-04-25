var JSFtp = require('jsftp');

function getFiles(param, callback) {
    var Ftp = new JSFtp({
        host:param.host
    });

    Ftp.auth(param.username, param.password, function (err) {
       if (err) {
           callback({msg:"Authentication failed",success:false});
       } else {
           var filename = param.source.split('/');
           Ftp.get(param.source, __dirname + '/../public/data/ftp/' + filename[filename.length-1] , function(hadErr) {
               if (hadErr){
                   //console.error('There was an error retrieving the file.');
               callback({msg:"There was an error retrieving the file.",success:false});
           }
               else
               {
                   //console.log('File copied successfully!');
                   callback({msg:"File copied successfully!",success:true});
               }
           });
       }
    });
}

module.exports = {
    getFiles:getFiles
};