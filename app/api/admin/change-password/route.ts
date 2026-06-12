import { NextRequest } from 'next/server'
import { checkAdminPassword, setAdminPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { currentPassword, newPassword } = await request.json()

  if (!currentPassword || !newPassword) {
    return Response.json({ error: '請填寫舊密碼與新密碼' }, { status: 400 })
  }
  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return Response.json({ error: '新密碼至少需要 6 個字元' }, { status: 400 })
  }
  if (!(await checkAdminPassword(currentPassword))) {
    return Response.json({ error: '舊密碼錯誤' }, { status: 401 })
  }

  await setAdminPassword(newPassword)
  return Response.json({ ok: true })
}
