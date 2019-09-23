//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
// code to listen for requests
const express = require('express');
var favicon = require('serve-favicon');
const app = express();

var args = process.argv.slice(2);

app.use(express.static(__dirname + args, {
  extensions: ['html']
}));

app.listen(8058, () => console.log("listening on port 8058"));
