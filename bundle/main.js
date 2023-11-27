const aHost = module {
  import { b } from "b";
  export { b };
}

const bHost = module {
  import "a";
  export const b = 'b';
};

const a = Module.withController(aHost.source);
const b = Module.withController(bHost.source);
a.link('b', b.module);
b.link('a', a.module);

const instance = await import(a);
export const { b } = instance;
