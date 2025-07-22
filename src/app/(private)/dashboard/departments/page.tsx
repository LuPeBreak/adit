import { DataTable } from '@/components/data-tables/data-table'
import { departmentColumns } from '@/components/data-tables/departments/departments-columns'
import prisma from '@/lib/prisma'

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={departmentColumns} data={departments} />
    </div>
  )
}
