import fs from 'fs-extra'
import { dirname, resolve } from 'pathe'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  rollup: {
    inlineDependencies: true,
    emitCJS: false,
    replace: {
      preventAssignment: false,
      delimiters: ['', ''],
      values: {
        'const isBrowser = ': 'const isBrowser = true ||',
        'window': '({})',
        "await fetch(": 'await (globalThis.__shiki_fetch__||globalThis.fetch)('
      }
    },
  },
  entries: [
    './src/shiki',
    './src/shiki.node'
  ],
  hooks: {
    async 'build:before'(ctx) {
      const genDir = resolve(ctx.options.rootDir, 'gen')
      await fs.mkdirp(genDir)

      const shiki = await import('shiki')
      const assets = [
        ...shiki.BUNDLED_LANGUAGES.map(lang => `languages/${lang.path}`),
        ...shiki.BUNDLED_THEMES.map(theme => `themes/${theme}.json`)
      ]
      const assetsCode = `export default {\n${assets.map(asset => `  '${asset}': () => import('shiki/${asset}')`).join(',\n')}\n}`
      await fs.writeFile(resolve(genDir, 'assets.ts'), assetsCode)

      const buff = await fs.readFile('./node_modules/shiki/dist/onig.wasm')
      await fs.writeFile(resolve(genDir, 'onig.ts'), `export default () => "${buff.toString('base64')}"`)
    },
    async 'rollup:done'(ctx) {
      const shikiDir = dirname(require.resolve('shiki/package.json'))
      const assetsDir = resolve(ctx.options.outDir, 'assets')
      for (const item of ['languages', 'themes', 'dist/onig.wasm']) {
        await fs.copy(resolve(shikiDir, item), resolve(assetsDir, item))
      }
      await fs.copy(resolve(shikiDir, 'dist/index.d.ts'), resolve(ctx.options.outDir, 'shiki.d.ts'))
    }
  }
})
