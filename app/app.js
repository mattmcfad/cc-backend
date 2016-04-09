'use strict';

const express = require('express');
const http = require('http');
const app = express();

app.set('port', process.env.PORT || 3010);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Server started at " + new Date().toISOString() + " on port " + app.get('port'));
});