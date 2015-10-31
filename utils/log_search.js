var fs = require('fs');
var time_stam = require('./time_stamp_regex');
var _ = require('underscore');

time_stam.find_index_of_time('/Users/raghavrastogi/Desktop/testFile.txt',function(time_stam){
  console.log(time_stam);
});


var highlighted_text = "S(100.100.12.10:80:UP)";
var highlighted_text_2 = "Hits";

var result = {};
var arr = [];
var attrib=[];
var num = [];

//function for generating regex
function searchTest(filename, callback) {
    var stream = fs.createReadStream(filename);
    var start = new Date().getTime();

    stream
          .on('data', function (data) {
              findOccurence(data, highlighted_text);
              findOccurence(data, highlighted_text_2);       
          })

          .addListener('close', function () {
              var time_taken = new Date().getTime() - start;
              console.log('Time ',time_taken);
              
              for(var i=0;i<result[highlighted_text].length;i++){
                 for(var j=0;j<result[highlighted_text_2].length;j++){
                   if(result[highlighted_text_2][j] > result[highlighted_text][i]){attrib.push(result[highlighted_text_2][j]);i+=1;}
                 }
               }
               console.log("Result is ", attrib,num);
            callback(num);
          });
}


function findOccurence (data, keyword) {
  var value = data.toString('utf-8');
  var new_regex = [];

  for (var i = 0; i < keyword.length; i++) {
    if(keyword[i] == ' ')
        new_regex.push('\s');
    else if (keyword[i] == '.' || keyword[i] == '[' || keyword[i] == ']' || keyword[i] == ':' || keyword[i] == '/' || highlighted_text[i] == '(' || highlighted_text[i] == ')') {
      new_regex.push('\\');
      new_regex.push(keyword[i]);
    }
    else{
      new_regex.push(keyword[i]);
    }
  }

//  new_regex.push('/');
  console.log(new_regex.join(""));

  var str = new_regex.join("");
  var hre = new RegExp(str,'g');

  //var re = new RegExp(str);
  findIndex(hre, value, keyword, function (keyword, indices) {
    result[keyword] = indices;
  });
}

function findIndex(pattern, value, keyword, cb) {
  process.nextTick(function () {
    var indices = [];
    while ((match = pattern.exec(value)) != null) {
        //console.log("match found at " + match.index);
        var matchAt = match.index;
      for(var i = matchAt;i < value.length;i++){ 
          
        if (!isNaN(value[i]) && !isNaN(value[i+1])) {
            num.push(value[i]);
            num.push(value[i+1]);
        }
        else if(!isNaN(value[i])){
            num.push(value[i]);
        }
        else if(isNaN(value[i])){
          continue;
        }
        else if(isNaN(value[i+1])){
            break;
        }

      }


        indices.push(match.index);
    }
    cb(keyword, indices);
  });
}



//searchTest('/Users/raghavrastogi/Desktop/testFile.txt');
//console.log(p);


module.exports = searchTest;

