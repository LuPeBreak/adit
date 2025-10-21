'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import {
  createTonerRequestNotificationTemplate,
  createTonerRequestConfirmationTemplate,
  createTonerRequestStatusUpdateTemplate,
} from '@/lib/notifications/templates/toner-request/email-template'
import {
  createTonerRequestConfirmationWhatsAppTemplate,
  createTonerRequestStatusUpdateWhatsAppTemplate,
} from '@/lib/notifications/templates/toner-request/whatsapp-template'

import {
  createMaintenanceRequestNotificationTemplate,
  createMaintenanceRequestConfirmationTemplate,
  createMaintenanceRequestStatusUpdateTemplate,
} from '@/lib/notifications/templates/maintenance-request/email-template'
import {
  createMaintenanceRequestConfirmationWhatsAppTemplate,
  createMaintenanceRequestStatusUpdateWhatsAppTemplate,
} from '@/lib/notifications/templates/maintenance-request/whatsapp-template'

import { MaintenanceStatus, TonerRequestStatus } from '@/generated/prisma'

import DashboardContainer from '@/components/dashboard-container'

// Dados falsos para toner - PENDING (sem observações)
const mockTonerDataPending = {
  requesterName: 'João Silva Santos',
  requesterEmail: 'joao.silva@pmbm.gov.br',
  requesterWhatsApp: '47999887766',
  selectedToner: 'HP CF283A - Preto',
  printerTag: 'IMP-ADM-001',
  printerModel: 'HP LaserJet Pro M404dn',
  department: 'Secretaria de Administração',
  sector: 'Recursos Humanos',
  status: 'PENDING' as TonerRequestStatus,
}

// Dados para toner APROVADO (sem observações)
const mockTonerDataApproved = {
  requesterName: 'João Silva Santos',
  requesterEmail: 'joao.silva@pmbm.gov.br',
  requesterWhatsApp: '47999887766',
  selectedToner: 'HP CF283A - Preto',
  printerTag: 'IMP-ADM-001',
  printerModel: 'HP LaserJet Pro M404dn',
  department: 'Secretaria de Administração',
  sector: 'Recursos Humanos',
  status: 'APPROVED' as TonerRequestStatus,
}

// Dados para toner REJEITADO (com observações vindas do rejectionReason)
const mockTonerDataRejected = {
  requesterName: 'João Silva Santos',
  requesterEmail: 'joao.silva@pmbm.gov.br',
  requesterWhatsApp: '47999887766',
  selectedToner: 'HP CF283A - Preto',
  printerTag: 'IMP-ADM-001',
  printerModel: 'HP LaserJet Pro M404dn',
  department: 'Secretaria de Administração',
  sector: 'Recursos Humanos',
  notes:
    'Toner ainda disponível no estoque da secretaria. Verificar antes de solicitar novo.',
  status: 'REJECTED' as TonerRequestStatus,
}

// Dados para toner ENTREGUE (com observações da entrega)
const mockTonerDataDelivered = {
  requesterName: 'João Silva Santos',
  requesterEmail: 'joao.silva@pmbm.gov.br',
  requesterWhatsApp: '47999887766',
  selectedToner: 'HP CF283A - Preto',
  printerTag: 'IMP-ADM-001',
  printerModel: 'HP LaserJet Pro M404dn',
  department: 'Secretaria de Administração',
  sector: 'Recursos Humanos',
  notes:
    'Toner entregue pessoalmente ao solicitante. Instalação realizada com sucesso.',
  status: 'DELIVERED' as TonerRequestStatus,
}

// Dados falsos para manutenção - PENDING (sem observações)
// Dados para manutenção com observações de atualização de status
const mockMaintenanceDataWithNotes = {
  requesterName: 'Maria Oliveira Costa',
  requesterEmail: 'maria.oliveira@pmbm.gov.br',
  requesterWhatsApp: '47988776655',
  assetTag: 'CPU-FIN-015',
  assetType: 'Computador Desktop',
  department: 'Secretaria de Finanças',
  sector: 'Contabilidade',
  description:
    'Computador não liga mais após queda de energia. LED da fonte pisca em vermelho.',
  notes:
    'Fonte de alimentação substituída. Equipamento testado e funcionando normalmente. Recomendamos uso de estabilizador.',
  status: 'MAINTENANCE' as MaintenanceStatus,
}

// Dados para manutenção em análise
const mockMaintenanceDataAnalyzing = {
  requesterName: 'Maria Oliveira Costa',
  requesterEmail: 'maria.oliveira@pmbm.gov.br',
  requesterWhatsApp: '47988776655',
  assetTag: 'CPU-FIN-015',
  assetType: 'Computador Desktop',
  department: 'Secretaria de Finanças',
  sector: 'Contabilidade',
  description:
    'Computador não liga mais após queda de energia. LED da fonte pisca em vermelho.',
  notes:
    'Pedido recebido e está sendo analisado pela equipe técnica. Aguarde contato.',
  status: 'ANALYZING' as MaintenanceStatus,
}

// Dados para manutenção concluída
const mockMaintenanceDataCompleted = {
  requesterName: 'Maria Oliveira Costa',
  requesterEmail: 'maria.oliveira@pmbm.gov.br',
  requesterWhatsApp: '47988776655',
  assetTag: 'CPU-FIN-015',
  assetType: 'Computador Desktop',
  department: 'Secretaria de Finanças',
  sector: 'Contabilidade',
  description:
    'Computador não liga mais após queda de energia. LED da fonte pisca em vermelho.',
  notes:
    'Manutenção concluída com sucesso. Fonte de alimentação substituída e sistema testado. Equipamento funcionando normalmente.',
  status: 'COMPLETED' as MaintenanceStatus,
}

// Dados para manutenção cancelada
const mockMaintenanceDataCancelled = {
  requesterName: 'Maria Oliveira Costa',
  requesterEmail: 'maria.oliveira@pmbm.gov.br',
  requesterWhatsApp: '47988776655',
  assetTag: 'CPU-FIN-015',
  assetType: 'Computador Desktop',
  department: 'Secretaria de Finanças',
  sector: 'Contabilidade',
  description:
    'Computador não liga mais após queda de energia. LED da fonte pisca em vermelho.',
  notes:
    'Pedido cancelado a pedido do solicitante. Equipamento foi substituído por novo modelo.',
  status: 'CANCELLED' as MaintenanceStatus,
}

const mockMaintenanceData = {
  requesterName: 'Maria Oliveira Costa',
  requesterEmail: 'maria.oliveira@pmbm.gov.br',
  requesterWhatsApp: '47988776655',
  assetTag: 'CPU-FIN-015',
  assetType: 'Computador Desktop',
  department: 'Secretaria de Finanças',
  sector: 'Contabilidade',
  description:
    'Computador não liga mais após queda de energia. LED da fonte pisca em vermelho.',
  status: 'PENDING' as MaintenanceStatus,
}

export default function TemplatesPreviewPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <DashboardContainer
        title="Preview de Templates"
        description="Visualize como ficam os templates de notificação"
      >
        <div className="space-y-8 mt-6">
          <div className="text-center py-8">
            <p>Carregando templates...</p>
          </div>
        </div>
      </DashboardContainer>
    )
  }
  return (
    <DashboardContainer
      title="Preview de Templates"
      description="Visualize como ficam os templates de notificação"
    >
      <div className="space-y-8 mt-6">
        {/* Seção de Templates de Toner */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Badge variant="secondary">Toner</Badge>
            Templates de Pedidos de Toner
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Confirmação de Pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Confirmação de Pedido</CardTitle>
                <CardDescription>
                  Template enviado ao solicitante (sem observações)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      createTonerRequestConfirmationTemplate(
                        mockTonerDataPending,
                      ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Confirmação de Pedido</CardTitle>
                <CardDescription>
                  Template enviado via WhatsApp (sem observações)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createTonerRequestConfirmationWhatsAppTemplate(
                    mockTonerDataPending,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status: Aprovado */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Status: Aprovado</CardTitle>
                <CardDescription>
                  Template com observações da aprovação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: createTonerRequestStatusUpdateTemplate(
                      mockTonerDataApproved,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Status: Aprovado</CardTitle>
                <CardDescription>
                  Template com observações da aprovação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createTonerRequestStatusUpdateWhatsAppTemplate(
                    mockTonerDataApproved,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status: Rejeitado */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Status: Rejeitado</CardTitle>
                <CardDescription>
                  Template com observações do motivo da rejeição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: createTonerRequestStatusUpdateTemplate(
                      mockTonerDataRejected,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Status: Rejeitado</CardTitle>
                <CardDescription>
                  Template com observações do motivo da rejeição
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createTonerRequestStatusUpdateWhatsAppTemplate(
                    mockTonerDataRejected,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status: Entregue */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Status: Entregue</CardTitle>
                <CardDescription>
                  Template com observações da entrega
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: createTonerRequestStatusUpdateTemplate(
                      mockTonerDataDelivered,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Status: Entregue</CardTitle>
                <CardDescription>
                  Template com observações da entrega
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createTonerRequestStatusUpdateWhatsAppTemplate(
                    mockTonerDataDelivered,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notificação para Administradores */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Email - Notificação para Administradores</CardTitle>
                <CardDescription>
                  Template enviado para a equipe de TI quando há um novo pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-blue-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      createTonerRequestNotificationTemplate(
                        mockTonerDataPending,
                      ),
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Seção de Templates de Manutenção */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Badge variant="outline">Manutenção</Badge>
            Templates de Pedidos de Manutenção
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Confirmação de Pedido */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Confirmação de Pedido</CardTitle>
                <CardDescription>
                  Template enviado ao solicitante (sem observações)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      createMaintenanceRequestConfirmationTemplate(
                        mockMaintenanceData,
                      ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Confirmação de Pedido</CardTitle>
                <CardDescription>
                  Template de confirmação via WhatsApp (sem observações)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createMaintenanceRequestConfirmationWhatsAppTemplate(
                    mockMaintenanceData,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Em Análise */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Em Análise</CardTitle>
                <CardDescription>
                  Template para status ANALYZING
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: createMaintenanceRequestStatusUpdateTemplate(
                      mockMaintenanceDataAnalyzing,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Em Análise</CardTitle>
                <CardDescription>
                  Template para status ANALYZING
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createMaintenanceRequestStatusUpdateWhatsAppTemplate(
                    mockMaintenanceDataAnalyzing,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Em Manutenção */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Em Manutenção</CardTitle>
                <CardDescription>
                  Template para status MAINTENANCE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: createMaintenanceRequestStatusUpdateTemplate(
                      mockMaintenanceDataWithNotes,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Em Manutenção</CardTitle>
                <CardDescription>
                  Template para status MAINTENANCE
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createMaintenanceRequestStatusUpdateWhatsAppTemplate(
                    mockMaintenanceDataWithNotes,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Concluído */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Concluído</CardTitle>
                <CardDescription>
                  Template para status COMPLETED
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: createMaintenanceRequestStatusUpdateTemplate(
                      mockMaintenanceDataCompleted,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Concluído</CardTitle>
                <CardDescription>
                  Template para status COMPLETED
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createMaintenanceRequestStatusUpdateWhatsAppTemplate(
                    mockMaintenanceDataCompleted,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Cancelado */}
            <Card>
              <CardHeader>
                <CardTitle>Email - Cancelado</CardTitle>
                <CardDescription>
                  Template para status CANCELLED
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-gray-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: createMaintenanceRequestStatusUpdateTemplate(
                      mockMaintenanceDataCancelled,
                    ),
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp - Cancelado</CardTitle>
                <CardDescription>
                  Template para status CANCELLED
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded p-4 bg-green-50 text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {createMaintenanceRequestStatusUpdateWhatsAppTemplate(
                    mockMaintenanceDataCancelled,
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Notificação para Administradores */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Email - Notificação para Administradores</CardTitle>
                <CardDescription>
                  Template enviado para a equipe de TI quando há um novo pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="border rounded p-4 bg-blue-50 text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      createMaintenanceRequestNotificationTemplate(
                        mockMaintenanceData,
                      ),
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardContainer>
  )
}
