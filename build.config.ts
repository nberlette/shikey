// import { copy, mkdirp, readFile, writeFile } from 'fs-extra'
// import { dirname, resolve } from 'pathe'
import { copy, mkdirp, readFile, writeFile } from 'fs-extra'
import { dirname, resolve } from 'pathe'
import { defineBuildConfig } from 'unbuild'

const shikiDir = dirname(require.resolve('shiki/package.json'))

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
        'await fetch(': 'await (globalThis.__shiki_fetch__||globalThis.fetch)(',
      },
    },
  },
  entries: [
    './src/shiki',
    './src/shiki.node',
  ],
  hooks: {
    'build:before': async ({ options: { rootDir } }) => {
      const genDir = resolve(rootDir, 'gen')
      await mkdirp(genDir)

      const shiki = await import('shiki')
      const assets = [
        ...shiki.BUNDLED_LANGUAGES.map(({ path }) => `languages/${path}`),
        ...shiki.BUNDLED_THEMES.map(theme => `themes/${theme}.json`),
      ].map(asset => `  '${asset}': () => import('shiki/${asset}')`)

      await writeFile(resolve(genDir, 'assets.ts'), `export default {\n${assets.join(',\n')}\n}`)
        .catch(console.error)

      await readFile(resolve(shikiDir, 'dist/onig.wasm'), 'base64')
        .then(async onigasm => await writeFile(
          resolve(genDir, 'onig.ts'),
            `export default () => "${onigasm}"`,
            'utf-8',
        ).catch(console.error))
        .catch(console.error)
    },
    'rollup:done': async ({ options: { outDir } }) => {
      for await (const item of ['languages', 'themes', 'dist/onig.wasm'])
        await copy(resolve(shikiDir, item), resolve(outDir, 'assets', item))

      await copy(resolve(shikiDir, 'dist/index.d.ts'), resolve(outDir, 'shiki.d.ts'))
    },
  },
})
