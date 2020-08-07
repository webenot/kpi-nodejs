'use strict';

const fs = require('fs');

let counter = 1;
fs.watch('./6-watch.js', (event, file) => {
  console.log(counter, {
    event,
    file,
  });
  counter++;
});
