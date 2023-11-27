function resolve(specifier, referrer) {
  return new URL(specifier, referrer).href;
}

const globalMap = new Map();

async function loadUrl(url) {
  const text = await fetch(url).then((r) => r.text());
  const stripped = stripTypescript(text);
  const source = new ModuleSource(stripped);
  return Module.withController(source, {
    loader: "none", // none = encapsulating, host (default) = js can still be dynamic imported (but not ts)
    moduleExpression(source) {
       Module.withController(source);
    },
    
    dynamicImportHook (instanceController, parentController) {
      const { specifier } = instanceController.instance.source.imports[0];
      instanceController.link(resolve(specifier, urlOf(parentController)));
    }
  });
}

function loadUrlCached(url) {
  if (!globalMap.has(url)) globalMap.set(url, loadUrl(url));
  return globalMap.get(url);
}

function getDeps(instance) {
  const deps = [];
  for (const { specifier } of instance.source.imports) {
    deps.push(specifier);
  }
  return deps;
}

async function link(controller, url, linkSet) {
  if (linkSet.has(controller)) return;
  linkSet.add(controller);
  const deps = getDeps(controller);
  await Promise.all(deps.map(async (dep) => {
    const depResolved = resolve(dep, url);
    const depController = await loadUrlCached(depResolved);
    controller.link(dep, depController.instance);
    await link(depController, depResolved, linkSet);
  }));
}

export async function importTypescript(url) {
  const controller = await loadUrlCached(url);
  const linked = await link(controller, url, new Set());
  return import(linked.instance);
}
