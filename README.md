
# shikey

Standalone build of [shiki](https://github.com/shikijs/shiki) fully compatible with all ESM environments.

## Install

```sh
pnpm add shikey
```

```sh
# yarn
yarn add shikey
```

```sh
# npm
npm i shikey
```

## Usage

```js
import { getHighlighter } from 'shikey'

const highlighter = await getHighlighter({ theme: 'nord' })

console.log(highlighter.codeToHtml('console.log(\'shiki\');', { lang: 'js' }))
```

## License

MIT
