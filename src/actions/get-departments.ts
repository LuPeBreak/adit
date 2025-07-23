import prisma from '@/lib/prisma'

export async function getDepartments() {
  const departments = await prisma.department.findMany({
    select: {
      name: true,
      manager: true,
      managerEmail: true,
    },
  })

  return departments
}
