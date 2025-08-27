import DashboardContainer from '@/components/dashboard-container'
import { getAssetsMetricsByType } from '@/actions/assets/get-assets-metrics-by-type'
import { getTonerRequestsMetrics } from '@/actions/toner-requests/get-toner-requests-metrics'
import { MetricCard } from '@/components/dashboard/metric-card'
import { AssetStatus } from '@/generated/prisma'

export default async function DashboardPage() {
  const [assetsMetrics, tonerMetrics] = await Promise.all([
    getAssetsMetricsByType(),
    getTonerRequestsMetrics(),
  ])

  // Helper function para calcular percentuais
  const calculatePercentage = (value: number, total: number) =>
    total > 0 ? (value / total) * 100 : 0

  const { assetsByStatus, totalAssets = 0 } = assetsMetrics.data || {}

  const assetsInUse = assetsByStatus?.[AssetStatus.USING] ?? 0
  const assetsInMaintenance = assetsByStatus?.[AssetStatus.MAINTENANCE] ?? 0
  const assetsInStock = assetsByStatus?.[AssetStatus.STOCK] ?? 0

  const percentageInUse = calculatePercentage(assetsInUse, totalAssets)
  const percentageInMaintenance = calculatePercentage(
    assetsInMaintenance,
    totalAssets,
  )
  const percentageInStock = calculatePercentage(assetsInStock, totalAssets)

  return (
    <DashboardContainer
      title="Dashboard"
      description="Visão geral dos ativos e métricas do sistema"
    >
      <div className="space-y-8 mt-8">
        {/* Seção de Métricas de Ativos */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Métricas Ativos
            </h2>
            <p className="text-sm text-muted-foreground">
              Estatísticas gerais dos ativos do sistema
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total de Ativos"
              description="Quantidade total de ativos cadastrados"
              value={totalAssets}
            />

            <MetricCard
              title="Ativos em Uso"
              description="Percentual de ativos atualmente em uso"
              value={`${percentageInUse.toFixed(1)}%`}
              secondaryValue={`${assetsInUse} de ${totalAssets}`}
            />

            <MetricCard
              title="Ativos em Manutenção"
              description="Quantidade de ativos atualmente em manutenção"
              value={`${percentageInMaintenance.toFixed(1)}%`}
              secondaryValue={`${assetsInMaintenance} de ${totalAssets}`}
            />

            <MetricCard
              title="Ativos em Estoque"
              description="Percentual de ativos atualmente em estoque"
              value={`${percentageInStock.toFixed(1)}%`}
              secondaryValue={`${assetsInStock} de ${totalAssets}`}
            />
          </div>
        </div>

        {/* Seção de Métricas de Toner */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Métricas de Pedidos de Toner
            </h2>
            <p className="text-sm text-muted-foreground">
              Estatísticas dos pedidos de toner do mês atual
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Pedidos do Mês"
              description="Total de pedidos de toner no mês atual"
              value={
                tonerMetrics.data?.tonerRequestsCurrentMonth?.totalRequests || 0
              }
            />

            <MetricCard
              title="Toners Entregues"
              description="Pedidos entregues no mês atual"
              value={
                tonerMetrics.data?.tonerRequestsCurrentMonth
                  ?.deliveredRequests || 0
              }
            />

            <MetricCard
              title="Toners Rejeitados"
              description="Pedidos rejeitados no mês atual"
              value={
                tonerMetrics.data?.tonerRequestsCurrentMonth
                  ?.rejectedRequests || 0
              }
            />

            <MetricCard
              title="Pedidos Pendentes"
              description="Pedidos aguardando aprovação"
              value={tonerMetrics.data?.pendingTonerRequests || 0}
            />
          </div>
        </div>
      </div>
    </DashboardContainer>
  )
}
