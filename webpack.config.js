import { fileURLToPath } from "url";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // 模式: 'development' 或 'production'
  mode: "development",
  entry: path.resolve(__dirname, "src/index.js"),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: { version: 3, proposals: true },
                },
              ],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    extensions: [".js", ".ts", ".json"],
    mainFiles: ["index"],
  },

  output: {
    library: "vue2-file-preview-directive",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  plugins: [
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "pdfjs"),
    //       to: path.resolve(__dirname, "pdfjs"),
    //     },
    //     {
    //       from: path.resolve(__dirname, "photoswipe"),
    //       to: path.resolve(__dirname, "photoswipe"),
    //     },
    //   ],
    // }),
  ],
};
