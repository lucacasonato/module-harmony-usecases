const mod = module {
  import { add } from "./math.js";
  export function add(a, b) {
    return a + b;
  }
};

const worker = new Worker(new URL("./worker.js", import.meta.url), {
  type: "module"
});
worker.postMessage(mod.source);