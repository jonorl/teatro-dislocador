// Only Jest reads this; the app itself runs on tsx. Tests compile to CommonJS so jest.mock() works without
// Node's experimental VM modules. CommonJS has no import.meta, so import.meta.url is rewritten from
// module.filename, which the source files' own `const __filename` declarations cannot shadow.
const importMetaUrl = ({ template }) => ({
  visitor: {
    MemberExpression(path) {
      const { object, property } = path.node;
      if (object.type === "MetaProperty" && object.meta.name === "import" && property.name === "url") {
        path.replaceWith(template.expression.ast`require("url").pathToFileURL(module.filename).href`);
      }
    },
  },
});

module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
  plugins: [importMetaUrl],
};
