const fs = require('fs');
const path = require('path');
const readline = require('readline');

const pathToDir = path.join(__dirname, 'hello.txt');
const writeableStream = fs.createWriteStream(pathToDir);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.output.write('Hello! Enter the text to write to the file: ');
// writeableStream.write('Hello! Enter the text to write to the file: ');

rl.on('line', (answer) => {
  if (answer.trim().toLowerCase() === 'exit') {
    console.log('Finishing the job...');
    writeableStream.end(
      'The user completes the introduction (command "exit").\n',
    );
    rl.close();
  } else {
    writeableStream.write(`${answer}\n`);
    rl.output.write('Enter the following text (or press Ctrl + C to exit): ');
  }
});

rl.on('SIGINT', () => {
  console.log('You pressed Ctrl + C. Finishing the job...');
  // writeableStream.end('You pressed Ctrl + C. Finishing the job...');
  process.exit();
});
