'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'

type Props = {
  value: string
  onChange: (html: string) => void
  uploadImage?: (file: File) => Promise<string | null>
  uploading?: boolean
}

const TOOLS = [
  { label: 'H1', title: '大標題', action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 1 }).run(), isActive: (e: ReturnType<typeof useEditor>) => !!e?.isActive('heading', { level: 1 }) },
  { label: 'H2', title: '副標題', action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleHeading({ level: 2 }).run(), isActive: (e: ReturnType<typeof useEditor>) => !!e?.isActive('heading', { level: 2 }) },
  { label: 'B', title: '粗體', bold: true, action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBold().run(), isActive: (e: ReturnType<typeof useEditor>) => !!e?.isActive('bold') },
  { label: 'I', title: '斜體', italic: true, action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleItalic().run(), isActive: (e: ReturnType<typeof useEditor>) => !!e?.isActive('italic') },
  { label: '• 條列', title: '條列項目', action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run(), isActive: (e: ReturnType<typeof useEditor>) => !!e?.isActive('bulletList') },
  { label: '── 分隔線', title: '水平分隔線', action: (e: ReturnType<typeof useEditor>) => e?.chain().focus().setHorizontalRule().run(), isActive: () => false },
] as const

export default function RichTextEditor({ value, onChange, uploadImage, uploading }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'rte-content outline-none' },
    },
  })

  return (
    <div style={{ border: '1px solid var(--brown-light)', borderRadius: 4, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap px-2 py-1.5" style={{ background: 'var(--cream)', borderBottom: '1px solid var(--brown-light)' }}>
        {TOOLS.map(tool => {
          const active = tool.isActive(editor)
          return (
            <button key={tool.label} type="button" title={tool.title}
              onClick={() => tool.action(editor)}
              style={{
                padding: '4px 10px',
                fontSize: 12,
                borderRadius: 4,
                border: `1px solid ${active ? 'var(--brown)' : 'var(--brown-light)'}`,
                background: active ? 'var(--brown)' : 'white',
                color: active ? 'white' : 'var(--brown)',
                fontWeight: (tool as { bold?: boolean }).bold ? 700 : 400,
                fontStyle: (tool as { italic?: boolean }).italic ? 'italic' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}>
              {tool.label}
            </button>
          )
        })}

        {uploadImage && (
          <label style={{
            marginLeft: 8,
            padding: '4px 10px',
            fontSize: 12,
            borderRadius: 4,
            border: '1px solid var(--brown)',
            color: 'var(--brown)',
            cursor: uploading ? 'not-allowed' : 'pointer',
            opacity: uploading ? 0.6 : 1,
          }}>
            📷 {uploading ? '上傳中...' : '插入圖片'}
            <input type="file" accept="image/*" className="hidden" disabled={uploading}
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file || !editor) return
                const url = await uploadImage(file)
                if (url) editor.chain().focus().setImage({ src: url }).run()
                e.target.value = ''
              }} />
          </label>
        )}
      </div>

      {/* Editor area */}
      <div style={{ background: 'var(--bg)', minHeight: 280, padding: '12px 14px' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
