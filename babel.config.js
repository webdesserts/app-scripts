module.exports = {
  presets: [
    ["@babel/preset-env", {
      targets: "> 0.25%, not dead",
      useBuiltIns: "usage",
      corejs: 3
    }],
    ["@babel/preset-typescript", {
      allowNamespaces: true
    }],
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties",
    ["babel-plugin-styled-components", { fileName: false }]
  ]
};
