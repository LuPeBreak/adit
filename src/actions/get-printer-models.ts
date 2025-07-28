import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getPrinterModels() {
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
        printerModel: ['list'],
      },
    },
  })

  // checa se o usuário tem permissão , se nao tiver deve ser redirecionado
  if (!permission.success) {
    return redirect('/dashboard')
  }

  const printerModels = await prisma.printerModel.findMany({
    select: {
      name: true,
      toners: true,
      _count: {
        select: {
          printers: true,
        },
      },
    },
  })

  return printerModels
}
