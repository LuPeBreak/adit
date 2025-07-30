'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import z from 'zod'

const deleteSectorSchema = z.object({
  id: z.string().cuid(),
})

type DeleteSectorValues = z.infer<typeof deleteSectorSchema>

export const deleteSectorAction = withPermissions(
  [{ resource: 'sector', action: ['delete'] }],
  async (_, data: DeleteSectorValues) => {
    const validatedFields = deleteSectorSchema.safeParse(data)
    if (!validatedFields.success) {
      return { success: false }
    }

    const { id } = validatedFields.data

    try {
      await prisma.sector.delete({
        where: { id },
      })

      revalidatePath('/dashboard/sectors')

      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false }
    }
  },
)
