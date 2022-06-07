import assets from '../gen/assets'
import wasm from '../gen/onig'
import { setCDN, setWasm } from './shiki'
export * from './shiki'

setCDN('-')

globalThis.__shiki_fetch__ = async (url: string) => {
  url = url.slice(1)
  const _asset = assets[url]
  if (!_asset)
    throw new Error(`Unknown asset: ${url}`)
  return {
    text: () => _asset().then((r: any) => JSON.stringify(r.default || r)),
  }
}

function toArrayBuffer(base64: string) {
  const buf = Buffer.from(base64, 'base64')
  const ab = new ArrayBuffer(buf.length)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buf.length; ++i)
    view[i] = buf[i]
  return ab
}

setWasm(toArrayBuffer(wasm()))
