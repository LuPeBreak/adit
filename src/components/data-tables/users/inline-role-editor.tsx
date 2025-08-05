'use client'

import { useState } from 'react'
import { Role } from '@/generated/prisma'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getRoleLabel, roles } from '@/lib/utils/role-utils'
import { updateUserRoleAction } from '@/actions/users/update-user-role'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth/auth-client'

interface InlineRoleEditorProps {
  userId: string
  currentRole: Role
}

export function InlineRoleEditor({
  userId,
  currentRole,
}: InlineRoleEditorProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const { data: session } = authClient.useSession()

  if (session?.user?.id === userId) {
    return <span className="px-3">{getRoleLabel(currentRole)}</span>
  }

  const handleRoleChange = async (newRole: Role) => {
    if (newRole === currentRole) return

    setIsUpdating(true)
    try {
      const result = await updateUserRoleAction({ id: userId, role: newRole })

      if (result.success) {
        toast.success('Cargo atualizado com sucesso!')
      } else {
        toast.error(result.error?.message || 'Erro ao atualizar cargo')
      }
    } catch (error) {
      console.error('Erro ao atualizar cargo:', error)
      toast.error('Erro interno ao atualizar cargo')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select
      value={currentRole}
      onValueChange={handleRoleChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-auto border-none bg-transparent hover:bg-muted focus:ring-0 focus:ring-offset-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
