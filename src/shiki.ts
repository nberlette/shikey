import {
  BUNDLED_LANGUAGES,
  BUNDLED_THEMES,
  FontStyle,
  getHighlighter,
  loadTheme,
  renderToHtml,
  setCDN,
  setWasm,
  toShikiTheme,
} from 'shiki'
import pkg from '../package.json'

setCDN(`https://cdn.jsdelivr.net/npm/shikey@${pkg.version}/dist/assets/`)

export {
  BUNDLED_LANGUAGES,
  BUNDLED_THEMES,
  FontStyle,
  getHighlighter,
  loadTheme,
  renderToHtml,
  setCDN,
  setWasm as setOnigasmWASM,
  setWasm,
  toShikiTheme,
}
