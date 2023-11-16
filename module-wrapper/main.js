// doesn't work with star re-export
import module inputMod from "./input.js";
import module instrumentMod from "./instrument.js";

const exports = [];
for (const entry of inputMod.source.exports) {
  if (entry.name !== null) {
    exports.push(entry.name);
  }
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
