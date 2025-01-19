const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDir, { withFileTypes: true }, (err, files) => {
  console.log('\nCurrent directory files:');
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      let size;
      const pathToFile = path.join(pathToDir, file.name);
      fs.stat(pathToFile, (err, stats) => {
        size = stats.size;

        const num = file[Object.getOwnPropertySymbols(file)[0]];
        if (num !== 2) {
          console.log(
            `${file.name.split('.')[0]} - ${
              path.extname(file.name).split('.')[1]
            } - ${size}`,
          );
        }
      });
    });
  }
});
