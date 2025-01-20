const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'assets');
const componentsDir = path.join(__dirname, 'components');
const pathStyles = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const projectDistPath = path.join(__dirname, 'project-dist');

const indexPath = path.join(projectDistPath, 'index.html');
const stylePath = path.join(projectDistPath, 'style.css');
const targetAssets = path.join(projectDistPath, 'assets');

async function generateIndexHTML() {
  try {
    let templateContent = await fs.readFile(templatePath, 'utf8');
    const tagMatches = templateContent.match(/{{\s*[\w-]+\s*}}/g);

    if (tagMatches) {
      for (const tag of tagMatches) {
        const tagName = tag.replace(/[{}]/g, '').trim();
        const componentPath = path.join(componentsDir, `${tagName}.html`);
        try {
          const componentContent = await fs.readFile(componentPath, 'utf8');
          templateContent = templateContent.replace(tag, componentContent);
        } catch {
          console.error(`Component ${tagName} not found.`);
        }
      }
    }
    await fs.writeFile(indexPath, templateContent);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Функция для объединения стилей
async function mergeStyles() {
  try {
    const files = await fs.readdir(pathStyles, { withFileTypes: true });

    let stylesArray = [];
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(pathStyles, file.name);
        const data = await fs.readFile(filePath, 'utf8');
        stylesArray.push(data);
      }
    }

    await fs.writeFile(stylePath, stylesArray.join('\n'));
  } catch (err) {
    console.error('Error:', err);
  }
}

// Функция копирования папки assets
async function copyDirectory(source, target) {
  try {
    await fs.mkdir(target, { recursive: true });

    const items = await fs.readdir(source, { withFileTypes: true });

    for (const item of items) {
      const sourcePath = path.join(source, item.name);
      const targetPath = path.join(target, item.name);

      if (item.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
      } else {
        await fs.copyFile(sourcePath, targetPath);
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function buildProject() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true }); // Создаём папку project-dist
    await copyDirectory(sourceDir, targetAssets); // Копируем assets
    await generateIndexHTML(); // Генерируем index.html
    await mergeStyles(); // Объединяем стили
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

buildProject();
