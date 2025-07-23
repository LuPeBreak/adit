import prisma from '@/lib/prisma'

export async function getSectors() {
  const sectors = await prisma.sector.findMany({
    select: {
      name: true,
      manager: true,
      managerEmail: true,
    },
  })

  return sectors
}
