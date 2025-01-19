const fs = require('fs');
const path = require('path');

const pathToDir = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    const files = await fs.promises.readdir(pathToDir, { withFileTypes: true });

    let stylesArray = [];

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(pathToDir, file.name);
        const data = await fs.promises.readFile(filePath, 'utf8');
        stylesArray.push(data);
      }
    }

    await fs.promises.writeFile(bundlePath, stylesArray.join('\n'));
  } catch (err) {
    console.error('Error:', err);
  }
}

mergeStyles();
