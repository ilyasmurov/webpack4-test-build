// nodejs модуль для работы с файловой системой
let fs = require("fs");

// работа с путями
const path = require("path");

const { build, themes, libs } = require("./variables.js");

module.exports = function(mode) {
  console.log("__________: ", mode);

  if (mode === "production") {
    // создаем папку билд
    const dirBuild = path.join(build);
    if (!fs.existsSync(dirBuild)) {
      fs.mkdirSync(dirBuild);
    }
  }

  // получаем список папок из themes
  const themesList = fs.readdirSync(`./src/${themes}`);

  if (mode === "production") {
    // создаем в папке билда папку themes
    const dirThemes = path.join(build, themes);
    if (!fs.existsSync(dirThemes)) {
      fs.mkdirSync(dirThemes);
    }
  }

  // копирование файлов
  const copyFilesList = [
    // копируем шритфы
    { from: "src/fonts", to: path.join(__dirname, "..", build, "fonts") },

    // копируем либы
    { from: `src/${libs}`, to: path.join(__dirname, "..", build, libs) }
  ];

  // обрабатываем пути проектов в themes и готовим entry
  let entry = {};
  for (let i = 0, max = themesList.length; i < max; i++) {
    let item = themesList[i];

    if (mode === "production") {
      // создаем папку темы в build/themes
      const dir = path.join(build, themes, item);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
    }

    const rootDir = path.resolve(__dirname, "..");

    const jsFile = path.resolve(rootDir, `src/${themes}/${item}/js/index.js`);
    if (fs.existsSync(jsFile)) {
      // добавляем js путь
      entry[`${themes}/${item}/index.min`] = jsFile;
    }

    const scssFile = path.resolve(
      rootDir,
      `src/${themes}/${item}/scss/index.scss`
    );
    if (fs.existsSync(scssFile)) {
      // добавляем scss путь для компиляции в css
      entry[`${themes}/${item}/styles`] = scssFile;
      // entry["styles"].push(`${themes}/${item}/styles`);
    }

    if (mode === "production") {
      const imagesFolder = path.join(rootDir, build, themes, item, "img");
      // создаем папку для картинок проекта в build
      if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
      }
    }

    // добавляем картинки проекта для копирования
    copyFilesList.push({
      from: `./src/${themes}/${item}/img`,
      to: path.join(rootDir, build, themes, item, "img")
    });
  }

  return { entry, copyFilesList };
};
