const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  // 模式: 'development' 或 'production'
  mode: "product",
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/pdfjs"),
          to: path.resolve(__dirname, "dist/pdfjs"),
        },
        {
          from: path.resolve(__dirname, "src/photoSwipe"),
          to: path.resolve(__dirname, "dist/photoSwipe"),
        },
      ],
    }),
  ],
};
