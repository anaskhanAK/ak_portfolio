import type { ReactNode } from 'react'

// Tiny, dependency-free Python highlighter. It is enough for short excerpts.
const KEYWORDS = new Set([
  'def', 'if', 'elif', 'else', 'return', 'not', 'and', 'or', 'in', 'for', 'while', 'raise', 'try', 'except',
  'import', 'from', 'as', 'None', 'True', 'False', 'lambda', 'with', 'class', 'async', 'await', 'is', 'pass',
])
const TOKEN = /(#[^\n]*)|(f?"(?:[^"\\\n]|\\.)*"|f?'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Za-z_][A-Za-z0-9_]*)/g

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = TOKEN.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const [text, comment, str, num, call, word] = m
    let cls = ''
    if (comment) cls = 'text-ink-4 italic'
    else if (str) cls = 'text-code-str'
    else if (num) cls = 'text-code-num'
    else if (call) cls = KEYWORDS.has(call) ? 'text-code-kw font-medium' : 'text-code-fn'
    else if (word && KEYWORDS.has(word)) cls = 'text-code-kw font-medium'
    out.push(cls ? <span key={k++} className={cls}>{text}</span> : text)
    last = m.index + text.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CodeBlock({ code, file, caption }: { code: string; file: string; caption: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-code-bg">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[12px] text-ink-2">
          <span className="flex gap-1" aria-hidden>
            <span className="size-2.5 rounded-full bg-line-2" />
            <span className="size-2.5 rounded-full bg-line-2" />
            <span className="size-2.5 rounded-full bg-line-2" />
          </span>
          {file}
        </span>
        <span className="font-mono text-[11px] text-ink-3">excerpt · condensed</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.65] text-ink md:px-5" tabIndex={0} aria-label={`Code excerpt from ${file}`}>
        <code>{highlight(code)}</code>
      </pre>
      <figcaption className="border-t border-line px-4 py-3 text-[13px] text-ink-2 md:px-5">{caption}</figcaption>
    </figure>
  )
}
