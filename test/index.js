#!/usr/bin/env node
/* eslint-disable @typescript-eslint/quotes */
import { getHighlighter } from 'shikey'

const highlight = async (str, { lang = 'js', theme = 'nord' } = {}) =>
  await getHighlighter({ theme }).then(({ codeToHtml }) => codeToHtml(str, { lang }))

const output = await highlight(`console.log('shikey');`, { theme: 'nord' })
const expected = `<pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #D8DEE9">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">&#39;</span><span style="color: #A3BE8C">shikey</span><span style="color: #ECEFF4">&#39;</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span></code></pre>`

process.exit((output === expected) ? 0 : 1)
