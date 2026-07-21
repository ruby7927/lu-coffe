import Image from 'next/image'

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

export default function PostContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let paraBuf: string[] = []
  let listBuf: string[] = []

  const flushPara = () => {
    if (paraBuf.length === 0) return
    const text = paraBuf.join('\n').trim()
    if (text) {
      blocks.push(
        <p key={`p-${blocks.length}`} className="text-base leading-loose mb-5 whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
          {renderInline(text)}
        </p>
      )
    }
    paraBuf = []
  }

  const flushList = () => {
    if (listBuf.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="text-base leading-loose mb-5 list-disc pl-6 space-y-2" style={{ color: 'var(--text)' }}>
        {listBuf.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
      </ul>
    )
    listBuf = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    // Image
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)
    if (imgMatch) {
      flushPara(); flushList()
      const [, alt, src] = imgMatch
      blocks.push(
        <div key={`img-${blocks.length}`} className="relative w-full aspect-[16/10] my-8 rounded-sm overflow-hidden" style={{ background: '#E8E0D5' }}>
          <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 672px" className="object-cover" />
        </div>
      )
      continue
    }

    // Horizontal rule
    if (line === '---') {
      flushPara(); flushList()
      blocks.push(<hr key={`hr-${blocks.length}`} className="my-8" style={{ borderColor: 'var(--cream)' }} />)
      continue
    }

    // H1
    if (line.startsWith('# ')) {
      flushPara(); flushList()
      blocks.push(
        <h2 key={`h1-${blocks.length}`} className="text-xl font-semibold mt-12 mb-5" style={{ color: 'var(--brown)' }}>
          {renderInline(line.slice(2))}
        </h2>
      )
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      flushPara(); flushList()
      blocks.push(
        <h3 key={`h2-${blocks.length}`} className="text-lg font-semibold mt-10 mb-4" style={{ color: 'var(--brown)' }}>
          {renderInline(line.slice(3))}
        </h3>
      )
      continue
    }

    // List item
    if (line.startsWith('- ')) {
      flushPara()
      listBuf.push(line.slice(2))
      continue
    }

    // Blank line
    if (line === '') {
      flushPara(); flushList()
      continue
    }

    // Plain line
    flushList()
    paraBuf.push(line)
  }

  flushPara(); flushList()

  return <div>{blocks}</div>
}
