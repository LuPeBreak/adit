import { DataTable } from '@/components/data-tables/data-table'
import { DepartmentTableToolbar } from '@/components/data-tables/departments/department-table-toolbar'
import { departmentColumns } from '@/components/data-tables/departments/departments-columns'
import prisma from '@/lib/prisma'

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Secretarias</h1>
      <DataTable
        columns={departmentColumns}
        data={departments}
        toolbar={<DepartmentTableToolbar />}
      />
    </div>
  )
}
