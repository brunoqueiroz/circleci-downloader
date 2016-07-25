var https    = require('https');
var configs  = require('./package.json');
var request  = require('request');
var _        = require('underscore');
var fs       = require('fs');

var args = process.argv.slice(2);

var build_number  = args[0]
var download_file = args[1]

var options = {
  url:  process.env.CIRCLECI_BASE_URL + build_number + '/artifacts?circle-token=' + process.env.CIRCLECI_TOKEN,
  json: true
}

console.log(__dirname);

request(options, function(error, response, body) {
  if (!error && response.statusCode == 200) {
      var res = response.body;
      var fileToDownload = _.find(res, function(arg) {
        return arg.url.indexOf(download_file) !== -1
      });

      var file = fs.createWriteStream(__dirname + '/' + download_file + ".jar");

      var request = https.get(fileToDownload.url + '?circle-token=' + process.env.CIRCLECI_TOKEN, function(response){
          response.pipe(file); 
          file.on('finish', function() {
            file.close();
            console.log('File ' + download_file + ' downloaded and saved at ' + __dirname);
          });
        });
  }
});
