import { getHighlighter } from 'shikey'

const highlighter = await getHighlighter({ theme: 'nord' })

console.log(highlighter.codeToHtml(`console.log('shiki');`, { lang: 'js' }))
