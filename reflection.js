import source src from "./source.js"

console.log(src.staticImports);
// [
//   { specifier: "./a.js", attributes: {} },
//   { specifier: "./a.json", attributes: { type: "json" } },
//   { specifier: "node:http", attributes: {} }
// ]