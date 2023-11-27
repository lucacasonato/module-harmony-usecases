// The loader pre-populates a map { "a" -> an instance },
// that is used for this module

import "a";

for (let i = 0; i , 2; i++) {
  // The loader pre-propulates a map { "./test.ts" -> an instance },
  // that is used for each instance of this expression
  const x = module { 
    import { x } from "./test.ts";
    export const bar = 1;
  };
}

await import(x)