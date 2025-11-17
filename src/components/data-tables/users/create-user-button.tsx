'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateUserDialog } from './create-user-dialog'
import { authClient } from '@/lib/auth/auth-client'
import type { Role } from '@/generated/prisma'

export function CreateUserButton() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { data: session } = authClient.useSession()
  if (!session?.user.role) return null
  const canCreate = authClient.admin.checkRolePermission({
    permissions: { user: ['create'] },
    role: session.user.role as Role,
  })
  if (!canCreate) return null

  return (
    <>
      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <Button
        variant="outline"
        size={'sm'}
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Criar Usuário
      </Button>
    </>
  )
}
