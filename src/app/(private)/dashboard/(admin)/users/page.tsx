import { UsersTableToolbar } from '@/components/data-tables/users/users-table-toolbar'
import { DataTable } from '@/components/data-tables/data-table'
import { getUsers } from '@/actions/get-users'
import { usersTableColumns } from '@/components/data-tables/users/users-table-columns'

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Lista de Usuários</h1>
      <DataTable
        columns={usersTableColumns}
        data={users}
        toolbar={<UsersTableToolbar />}
      />
    </div>
  )
}
