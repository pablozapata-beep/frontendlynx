import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const brandsDir = join(__dirname, '..', 'brands')
const distDir = join(__dirname, '..', 'dist')

mkdirSync(distDir, { recursive: true })

function flatten(obj, prefix = []) {
  return Object.entries(obj).flatMap(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return flatten(value, [...prefix, key])
    }
    return [[[...prefix, key].join('-'), value]]
  })
}

const brandFiles = readdirSync(brandsDir).filter((f) => f.endsWith('.json'))
const allImports = []

for (const file of brandFiles) {
  const raw = readFileSync(join(brandsDir, file), 'utf-8')
  const json = JSON.parse(raw)
  const { brand, ...tokens } = json
  const vars = flatten(tokens)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n')

  let css = `[data-brand="${brand}"] {\n${vars}\n}\n`

  // Overrides de diseño opcionales: CSS de mano, scoped por la marca, para
  // divergencias que no se pueden expresar como el valor de una variable
  // (forma, microinteracciones). Ver README > "Overrides de diseño por marca".
  const overridesPath = join(brandsDir, `${brand}.overrides.css`)
  const hasOverrides = existsSync(overridesPath)
  if (hasOverrides) {
    const overrides = readFileSync(overridesPath, 'utf-8')
    css += `\n/* --- overrides de diseño de "${brand}" --- */\n${overrides}\n`
  }

  const outFile = `${brand}.css`
  writeFileSync(join(distDir, outFile), css)
  allImports.push(outFile)
  console.log(`tokens: generado dist/${outFile}${hasOverrides ? ' (con overrides)' : ''}`)
}

const indexCss = allImports.map((f) => `@import './${f}';`).join('\n') + '\n'
writeFileSync(join(distDir, 'index.css'), indexCss)
console.log('tokens: generado dist/index.css')
