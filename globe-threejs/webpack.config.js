const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./main.js", // 번들링 시작점

  output: {
    filename: "bundle.js", // 출력 파일명
    path: path.resolve(__dirname, "dist"), // 출력 경로
    publicPath: "/", // 추가된 설정
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
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // 여기서 경로는 프로젝트에 맞게 조정하세요
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"), // 변경된 설정
    },
    port: 8080, // 원하는 포트 번호를 설정하세요
  },
};
