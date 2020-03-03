// nodejs модуль для работы с файловой системой
let fs = require("fs");

// работа с путями
const path = require("path");

// обработка css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// csso
const CssoWebpackPlugin = require("csso-webpack-plugin").default;
const cssoConfig = require("./cssoConfig.js");

// плагин копирования файалов
const CopyPlugin = require("copy-webpack-plugin");

// clear build
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// папка билда
const build = "./build/";

// создаем папку билд
let dir = path.join(build);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// каталог тем
const themes = "themes";

// каталог libs
const libs = "libs";

// получаем список папок из themes
const themesList = fs.readdirSync(`./src/${themes}`);

// создаем в папке билда папку themes
dir = path.join(build, themes);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// копирование файлов
const copyFilesList = [
  // копируем шритфы
  { from: "src/fonts", to: path.join(__dirname, build, "fonts") },

  // копируем либы
  { from: `src/${libs}`, to: path.join(__dirname, build, libs) }
];

// обрабатываем пути проектов в themes и готовим entry
let entry = {};
for (let i = 0, max = themesList.length; i < max; i++) {
  let item = themesList[i];

  // создаем папку темы в build/themes
  let dir = path.join(build, themes, item);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const jsFile = path.resolve(__dirname, `src/${themes}/${item}/js/index.js`);
  if (fs.existsSync(jsFile)) {
    // добавляем js путь
    entry[`${themes}/${item}/index.min`] = jsFile;
  }

  const scssFile = path.resolve(
    __dirname,
    `src/${themes}/${item}/scss/index.scss`
  );
  if (fs.existsSync(scssFile)) {
    // добавляем scss путь для компиляции в css
    entry[`${themes}/${item}/styles`] = scssFile;
  }

  const imagesFolder = path.join(build, themes, item, "img");
  // создаем папку для картинок проекта в build
  if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder);
  }

  // добавляем картинки проекта для копирования
  copyFilesList.push({
    from: `src/${themes}/${item}/img`,
    to: path.join(__dirname, build, themes, item, "img")
  });
}

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  const config = {
    context: path.resolve(__dirname),
    entry: entry,
    output: {
      path: path.join(__dirname, build)
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                url: false,
                sourceMap: true
              }
            },
            { loader: "sass-loader", options: { sourceMap: true } }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new CssoWebpackPlugin(cssoConfig),
      new CopyPlugin(copyFilesList)
    ]
  };

  return config;
};
