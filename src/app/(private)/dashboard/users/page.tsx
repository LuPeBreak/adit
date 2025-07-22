import { DataTable } from '@/components/data-tables/data-table'
import { userColumns } from '@/components/data-tables/users/users-columns'
import prisma from '@/lib/prisma'

export default async function UsersPage() {
  const users = await prisma.user.findMany()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={userColumns} data={users} />
    </div>
  )
}
