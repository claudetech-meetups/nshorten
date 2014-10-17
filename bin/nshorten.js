#!/usr/bin/env node

var nshorten = require('../lib');

function usage (msg) {
  if (msg) console.warn(msg);
  console.log("usage: nshorten [--login] URL")
  process.exit(msg ? 1 : 0);
}

var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['login'],
  alias: {l: 'login', h: 'help'}
});


if (argv.h) usage();
if (!argv.login && argv._.length !== 1) usage("Needs a single URL");

function fail(msg) {
  console.warn(msg);
  process.exit(1);
}

if (argv.login) {
  nshorten.login(function (err, result) {
    if (err) fail("Unable to login: " + err.message);
    console.log("Successfully logged in.");
  });
} else {
  var url = argv._[0];
  var config = nshorten.readConfig(function (err, config) {
    if (err) fail("Could not read config: " + err.message + "\nTry running 'nshorten --login'");
    nshorten.shorten(url, config, function (err, res) {
      if (err) fail(err.message);
      console.log(res);
    });
  });
}
