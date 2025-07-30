'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const updateDepartmentSchema = z.object({
  id: z.string(),
  name: z.string().min(5),
  manager: z
    .string()
    .min(5)
    .refine(
      (managerName) =>
        managerName.split(' ').filter((name) => name.length > 0).length >= 2,
    ),
  managerEmail: z.string().email(),
})

type UpdateDepartmentValues = z.infer<typeof updateDepartmentSchema>

export const updateDepartmentAction = withPermissions(
  [{ resource: 'department', action: ['update'] }],
  async (_, data: UpdateDepartmentValues) => {
    const validatedFields = updateDepartmentSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false, data: null }
    }

    const { id, ...departmentData } = validatedFields.data

    try {
      const updatedDepartment = await prisma.department.update({
        where: { id },
        data: departmentData,
      })

      revalidatePath('/dashboard/departments')

      return { success: true, data: updatedDepartment }
    } catch (error) {
      console.error(error)
      return { success: false, data: null }
    }
  },
)
