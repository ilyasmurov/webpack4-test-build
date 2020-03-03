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

const { build } = require("./variables.js");

const { entry, copyFilesList } = require("./entry.js");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  const config = {
    context: path.resolve(__dirname, ".."),
    entry: entry,
    output: {
      path: path.join(__dirname, "..", build)
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
