const ts = require("rollup-plugin-ts");
const pkg = require("./package.json");

export default {
  input: "./src/card3d.ts",
  output: [
    {
      file: pkg.main,
      name: "Card3d",
      format: "umd",
      sourcemap: true,
    },
  ],
  plugins: [ts()],
};
