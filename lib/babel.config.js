module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: "> 0.25%, not dead",
      useBuiltIns: "usage",
      corejs: "3.8"
    }],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    ["babel-plugin-styled-components", { fileName: false }],
    ["@babel/plugin-transform-runtime", {
      absoluteRuntime: true,
      corejs: "3"
    }],
  ]
};
