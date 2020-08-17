'use strict';

const net = require('net');

const onData = data => {
  console.dir({ data });
  console.log('📨:'.toString('utf8'), data.toString('utf8'));
};

net.createServer(socket => {
  console.dir(socket.address());
  socket.setNoDelay(true);
  socket.on('data', onData);
  socket.on('error', err => {
    console.log('Server error: ', err);
  });
  socket.on('end', () => {
    console.log('client disconnected');
  });
  socket.write('Hello from server 💗');
}).listen(2000, '0.0.0.0');
