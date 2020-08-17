'use strict';

const net = require('net');

const socket = new net.Socket();

socket.on('data', data => {
  console.dir({ data });
  console.log('📨:'.toString('unicode'), data.toString('utf8'));
});

socket.on('error', err => {
  console.log('Socket error: ', err);
});
socket.on('end', () => {
  console.log('End Connection');
});

socket.connect({
  port: 2000,
  host: '127.0.0.1',
}, () => {
  socket.write('Hello from client 💋');
  setTimeout(() => {
    socket.unref();
  }, 5000);
});
