'use server'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getSectors() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // checa para ver se esta autenticado, se nao estiver deve ser redirecionado
  if (!session) return redirect('/login')

  // pega a permissão do usuário para podermos verificar.
  const permission = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permission: {
        sector: ['list'],
      },
    },
  })

  // checa se o usuário tem permissão , se nao tiver deve ser redirecionado
  if (!permission.success) {
    return redirect('/dashboard')
  }

  const sectors = await prisma.sector.findMany({
    select: {
      name: true,
      manager: true,
      managerEmail: true,
    },
  })

  return sectors
}
