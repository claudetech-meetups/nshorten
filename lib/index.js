var request    = require('request'),
    fs         = require('fs'),
    path       = require('path'),
    qs         = require('querystring'),
    prompt     = require('prompt'),
    shortenUrl = "https://api-ssl.bitly.com/v3/shorten?",
    configPath = path.join(process.env.HOME || process.env.USERPROFILE, ".nshortenrc");


exports.shorten = function (longUrl, config, callback) {
  if (!config.token) return callback(new Error("you need a token"));
  var data = {access_token: config.token, longUrl: longUrl},
      url  = shortenUrl + qs.stringify(data);

  request.get({url: url, json: true}, function (err, response, body) {
    if (err) return callback(err);
    if (body.status_code !== 200) return callback(new Error(body.status_txt));
    callback(null, body.data.url);
  });
};


exports.login = function (callback) {
  prompt.start();
  prompt.message = "nshorten";
  prompt.get(['token'], function (err, result) {
    if (err) return callback(err);
    var dummyUrl = "http://claudetech.com";
    exports.shorten(dummyUrl, result, function (err) {
      if (err) return callback(err);
      fs.writeFile(configPath, JSON.stringify(result, null, 4), callback);
    });
  });
};


exports.readConfig = function (callback) {
  fs.readFile(configPath, 'utf8', function (err, data) {
    if (err) return callback(err);
    try {
      var config = JSON.parse(data);
      callback(null, config);
    } catch (e) {
      callback(new Error("could not parse configuration"));
    }
  });
};
