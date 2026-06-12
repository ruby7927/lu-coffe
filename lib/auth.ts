import { prisma } from './prisma'
import type { NextRequest } from 'next/server'

const ADMIN_PW_KEY = 'admin_password'

/** Returns the currently-active admin password (DB override beats env). */
export async function getAdminPassword(): Promise<string | undefined> {
  const setting = await prisma.setting.findUnique({ where: { key: ADMIN_PW_KEY } })
  return setting?.value ?? process.env.ADMIN_PASSWORD
}

export async function checkAdminPassword(pw: string | null): Promise<boolean> {
  if (!pw) return false
  const current = await getAdminPassword()
  return !!current && pw === current
}

export async function checkAdminRequest(request: NextRequest): Promise<boolean> {
  return checkAdminPassword(request.headers.get('x-admin-pw'))
}

export async function setAdminPassword(newPw: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key: ADMIN_PW_KEY },
    update: { value: newPw },
    create: { key: ADMIN_PW_KEY, value: newPw },
  })
}
