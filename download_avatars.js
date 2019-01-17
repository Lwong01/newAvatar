var request = require('request');
var token = require('./secrets');
var args = process.argv.splice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + token.GITHUB_TOKEN,

    }
  };

  request(options, function (err, res, body) {
    if (res.statusCode > 200) {
      err = res.statusCode;
    }
    var data = JSON.parse(body);
    cb(err, data);
  });
}

function downloadImageByURL(url, filePath) {
  var fs = require('fs');
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function(response){
      console.log("Status", response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath))
}

getRepoContributors(args[0], args[1], function(err, contributors) {
  if (err) {
    console.log('ERROR: ', err);
    return;
  }
  contributors.forEach(function(contributor){
    downloadImageByURL(contributor.avatar_url, "./download/"+ contributor.login + ".jpg");
  });
})
// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "kvirani.jpg");
