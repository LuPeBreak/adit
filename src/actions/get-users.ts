import { userSchema } from '@/components/data-tables/users/users-table-schema'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'

export async function getUsers() {
  const { users } = await auth.api.listUsers({
    query: {},
    headers: await headers(),
  })

  if (!users) return []

  const parsedUser = users.map((user) => userSchema.parse(user))

  return parsedUser
}
