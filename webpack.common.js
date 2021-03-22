const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_moules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
};
