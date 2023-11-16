import source testSrc from "./test/index.js";
import module mockApi from "./test.js";
testSrc; // ModuleSource { ... }
mockApi; // Module { ... }

const controller = Module.withController(testSrc, {
  loader: "host",
});
controller.link("api", mockApi);

await import(controller.module);

