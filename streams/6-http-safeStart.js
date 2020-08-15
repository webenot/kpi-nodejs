'use strict';

const fs = require('fs');
const zlib = require('zlib');
const http = require('http');

const prepareCache = callback => {
  let buffer = null;

  const rs = fs.createReadStream('index.html', 'utf8');
  const gs = zlib.createGzip();

  const buffers = [];

  gs.on('data', buffer => {
    buffers.push(buffer);
  });

  gs.once('end', () => {
    buffer = Buffer.concat(buffers);
    if (callback) {
      callback(null, buffer);
      callback = null;
    }
  });

  rs.on('error', error => {
    if (callback) {
      callback(error);
      callback = null;
    }
  });

  gs.on('error', error => {
    if (callback) {
      callback(error);
      callback = null;
    }
  });

  rs.pipe(gs);
};

const startServer = (err, buffer) => {
  if (err) throw err;

  const server = http.createServer((request, response) => {
    console.log(request.url);
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    response.end(buffer);
  });

  server.listen(8000);
};

prepareCache(startServer);
