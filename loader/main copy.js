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
    
  });
}

function loadUrlCached(url) {
  if (!globalMap.has(url)) globalMap.set(url, loadUrl(url));
  return globalMap.get(url);
}

function getDeps(source) {
  const deps = [];
  for (const { specifier } of source.imports) {
    deps.push(specifier);
  }
  return deps;
}

async function link(controller, url, linkSet) {
  if (linkSet.has(controller)) return;
  linkSet.add(controller);

  const sourcesAndLinkers = [{
    source: controller.instance.source,
    setSingleLinkage: controller.link
  }, ...controller.instance.source.innerSources.map((source, i) => ({
    source,
    setSingleLinkage: controller.innerLink[i]
  }))];

  await Promise.all(sourcesAndLinkers.map(async ({ source, setSingleLinkage }) => {
    const deps = getDeps(source);
  
    await Promise.all(deps.map(async (dep) => {
      const depResolved = resolve(dep, url);
      const depController = await loadUrlCached(depResolved);
      setSingleLinkage(dep, depController.instance);
      await link(depController, depResolved, linkSet);
    }));
  }));
}

export async function importTypescript(url) {
  const controller = await loadUrlCached(url);
  const linked = await link(controller, url, new Set());
  return import(linked.instance);
}
