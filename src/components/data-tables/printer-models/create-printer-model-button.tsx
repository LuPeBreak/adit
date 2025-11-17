'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { PrinterModelDialogForm } from './printer-model-dialog-form'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'

export function CreatePrinterModelButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return null
  const canCreate = authClient.admin.checkRolePermission({
    permissions: { printerModel: ['create'] },
    role: session.user.role as Role,
  })
  if (!canCreate) return null

  return (
    <>
      <PrinterModelDialogForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Modelo
      </Button>
    </>
  )
}
