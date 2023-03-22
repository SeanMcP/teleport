// deno run --allow-read --allow-write main.ts path/to/file.css

// TODO: Handle configuration
// https://deno.land/std@0.180.0/flags/mod.ts
const files = Deno.args

// https://stackoverflow.com/a/73891404
async function replaceAsync(string: String, regexp: RegExp, replacerFunction: (match: RegExpMatchArray) => Promise<string>) {
  const replacements = await Promise.all(
    Array.from(string.matchAll(regexp),
      match => replacerFunction(match)));
  let i = 0;
  return string.replace(regexp, () => replacements[i++]);
}

for (const file of files) {
  // TODO: Check compatibility with Windows
  const entryPath = 'file://' + await Deno.realPath(file)
  const text = await Deno.readTextFile(file)
  const out = await replaceAsync(text, /@import url\(["'`](.+)["'`]\);/g, async ([match, path]) => {
    const importPath = new URL(path, entryPath);
    const text = await Deno.readTextFile(importPath)
    return `/** ${match} */\n` + text.trim()
  })
  // TODO: Parameterize the output directory
  const outDir = 'out'
  await Deno.mkdir(outDir, { recursive: true })
  const fileName = entryPath.slice(entryPath.lastIndexOf('/'))
  await Deno.writeTextFile(`${outDir}/${fileName}`, out)
}
