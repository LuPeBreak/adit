'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CreatePrinterDialogForm } from './create-printer-dialog-form'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'

export function CreatePrinterButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return null
  const canCreate = authClient.admin.checkRolePermission({
    permissions: { printer: ['create'] },
    role: session.user.role as Role,
  })
  if (!canCreate) return null

  return (
    <>
      <CreatePrinterDialogForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Impressora
      </Button>
    </>
  )
}
