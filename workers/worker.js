self.onmessage = async (e) => {
  const src = e.data; // ModuleSource { ... }
  const mod = new Module(src); // Module { ... }
  const { add } = await import(mod);
};
