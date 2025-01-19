const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

// Функция удаления существующей папки перед копированием
async function removeDirectory(directory) {
  try {
    await fs.rm(directory, { recursive: true, force: true });
  } catch (error) {
    console.error(`Ошибка при удалении папки ${directory}:`, error);
  }
}

async function copyDirectory(source, target) {
  try {
    await fs.mkdir(target, { recursive: true });
    const items = await fs.readdir(source);

    for (const item of items) {
      const sourcePath = path.join(source, item);
      const targetPath = path.join(target, item);

      const stat = await fs.stat(sourcePath);

      if (stat.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  } catch (error) {
    console.error(`Ошибка при копировании: ${error.message}`);
  }
}

// Основная функция копирования
async function copyDir() {
  await removeDirectory(targetDir);
  await copyDirectory(sourceDir, targetDir);
}

copyDir();
