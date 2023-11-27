import module inputMod from "./input.js";
import module instrumentMod from "./instrument.js";

const exports = [];
for (const entry of inputMod.source.exports) {
  switch (entry.type) {
    case "named":
      exports.push(entry.name);
      break;
    case "star":
      // needs special case because linker is eager, skipped for now
      break;
  }

let src = "import * as input from 'original'; import instrument from 'instrument';\n";
for (const name of exports) {
  // needs special case for default, skipped for brevity
  src += `export var ${name} = instrument(input.${name});\n`;
}

const source = new ModuleSource(src)

const controller = Module.withController(source);
controller.link("original", inputMod);
controller.link("instrument", instrumentMod);

const mod = await import(controller.module);
