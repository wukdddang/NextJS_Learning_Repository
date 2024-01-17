const path = require("path");

module.exports = {
  mode: "development",
  entry: "./index.js", // 번들링 시작점
  output: {
    filename: "bundle.js", // 출력 파일명
    path: path.resolve(__dirname, "dist"), // 출력 경로
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
