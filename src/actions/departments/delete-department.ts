'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const deleteDepartmentSchema = z.object({
  id: z.string().cuid(),
})

type DeleteDepartmentValues = z.infer<typeof deleteDepartmentSchema>

export const deleteDepartmentAction = withPermissions(
  [{ resource: 'department', action: ['delete'] }],
  async (_, data: DeleteDepartmentValues) => {
    const validatedFields = deleteDepartmentSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false }
    }

    const { id } = validatedFields.data

    try {
      await prisma.department.delete({
        where: { id },
      })

      revalidatePath('/dashboard/departments')

      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false }
    }
  },
)
