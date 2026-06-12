import { NextRequest } from 'next/server'
import { put } from '@vercel/blob'
import { checkAdminRequest } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  if (!(await checkAdminRequest(request))) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      { error: '尚未設定 Vercel Blob：請先在 Vercel Dashboard 開 Blob store（Storage 分頁）後再試。' },
      { status: 500 },
    )
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: '請改用 multipart/form-data 上傳' }, { status: 400 })
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return Response.json({ error: '缺少檔案' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: '檔案請小於 5 MB' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return Response.json({ error: '請上傳圖片檔' }, { status: 400 })
  }

  const folder = (form.get('folder') as string) || 'uploads'
  const safeFolder = folder.replace(/[^a-z0-9_-]/gi, '').slice(0, 40) || 'uploads'

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6) || 'bin'
  const name = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  try {
    const blob = await put(name, file, { access: 'public', addRandomSuffix: false })
    return Response.json({ url: blob.url, pathname: blob.pathname })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'upload failed'
    return Response.json({ error: msg }, { status: 500 })
  }
}
