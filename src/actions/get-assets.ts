'use server'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getAssets() {
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
        asset: ['list'],
      },
    },
  })

  // checa se o usuário tem permissão , se nao tiver deve ser redirecionado
  if (!permission.success) {
    return redirect('/dashboard')
  }

  const assets = await prisma.asset.findMany({
    select: {
      tag: true,
      status: true,
      assetType: true,
      sector: {
        select: {
          name: true,
          department: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  const formattedAssets = assets.map((asset) => {
    return {
      tag: asset.tag,
      assetType: asset.assetType,
      status: asset.status,
      sector: asset.sector.name,
      department: asset.sector.department.name,
    }
  })

  return formattedAssets
}
