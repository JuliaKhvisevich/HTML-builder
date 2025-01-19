const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'text.txt');

let data = '';

let readerStream = fs.createReadStream(pathToDir);

readerStream.setEncoding('UTF8');
readerStream.on('data', function (chunk) {
  data += chunk;
});

readerStream.on('end', function () {
  console.log(data);
});
