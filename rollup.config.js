const commonjs = require("@rollup/plugin-commonjs")
const { babel } = require("@rollup/plugin-babel")
const pkg = require("./package.json");

export default {
  input: "./src/card3d.js",
  output: [
    {
      file: pkg.main,
      name: "Card3d",
      format: "umd",
      sourcemap: true,
    },
  ],
  plugins: [commonjs(), babel({ babelHelpers: "bundled" })],
};
