'use server'

import { auth } from '@/lib/auth/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getPrinters() {
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
        printer: ['list'],
      },
    },
  })

  // checa se o usuário tem permissão , se nao tiver deve ser redirecionado
  if (!permission.success) {
    return redirect('/dashboard')
  }

  const printers = await prisma.printer.findMany({
    select: {
      serialNumber: true,
      ipAddress: true,
      printerModel: {
        select: {
          name: true,
        },
      },
      asset: {
        select: {
          tag: true,
          status: true,
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
      },
    },
  })

  const formattedPrinters = printers.map((printer) => {
    return {
      serialNumber: printer.serialNumber,
      ipAddress: printer.ipAddress,
      printerModel: printer.printerModel.name,
      tag: printer.asset.tag,
      status: printer.asset.status,
      sector: printer.asset.sector.name,
      department: printer.asset.sector.department.name,
    }
  })

  return formattedPrinters
}
