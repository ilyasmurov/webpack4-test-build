const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssoWebpackPlugin = require("csso-webpack-plugin").default;
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

const cssoConfig = require("./cssoConfig.js");

module.exports = (env, argv) => {
  const { mode } = argv;

  const { build } = require("./variables.js");

  const { entry, copyFilesList } = require("./entry.js")(mode);

  console.log("entry: ", entry);

  const config = {
    context: path.resolve(__dirname, ".."),
    entry: entry,
    output: {
      path: path.join(__dirname, "..", build),
      publicPath: "/",
      library: "myLib"
      // libraryTarget: "umd"
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
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(jpg|png|gif|svg)$/,
          loader: "image-webpack-loader",
          enforce: "pre"
        }
      ]
    },
    devtool: mode === "production" ? false : "source-map",
    plugins: [
      new CleanWebpackPlugin({
        dry: mode !== "production"
      }),
      new MiniCssExtractPlugin(),
      new CssoWebpackPlugin(cssoConfig),
      new CopyPlugin(copyFilesList),
      new FixStyleOnlyEntriesPlugin(), // удаляет сгенерированные файлы styles.js из entry (бага вебпака)
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      })
    ],
    optimization: {
      minimizer: [new UglifyJsPlugin()],
      runtimeChunk: "single"
      // removeAvailableModules: true,
      // removeEmptyChunks: true
    },
    target: "node",
    devServer: {
      publicPath: "/",
      contentBase: path.join(__dirname, build),
      watchContentBase: true,
      port: 9000,
      hot: true,
      open: true
      // historyApiFallback: true
      // writeToDisk: true
      // proxy: {
      //   "/api": "http://localhost:3000"
      // },
      // public: "localhost:9000",
    }
  };

  return config;
};
