'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const createDepartmentSchema = z.object({
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

type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>

export const createDepartmentAction = withPermissions(
  [{ resource: 'department', action: ['create'] }],
  async (_, data: CreateDepartmentFormValues) => {
    const validatedFields = createDepartmentSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false }
    }

    const { name, manager, managerEmail } = validatedFields.data

    try {
      await prisma.department.create({
        data: {
          name,
          manager,
          managerEmail,
        },
      })

      revalidatePath('/dashboard/departments')

      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false }
    }
  },
)
