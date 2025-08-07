import { getTonerRequests } from '@/actions/toner-requests/get-toner-requests'
import { tonerRequestsTableColumns } from '@/components/data-tables/toner-requests/toner-requests-table-columns'
import { TonerRequestsTableToolbar } from '@/components/data-tables/toner-requests/toner-requests-table-toolbar'
import { DataTable } from '@/components/data-tables/data-table'

export default async function TonerRequestsPage() {
  const tonerRequests = await getTonerRequests()

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl">Pedidos de Toner</h1>
      <DataTable
        columns={tonerRequestsTableColumns}
        data={tonerRequests}
        toolbar={<TonerRequestsTableToolbar />}
      />
    </div>
  )
}
