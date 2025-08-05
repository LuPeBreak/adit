'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BasicDialog } from '@/components/basic-dialog'
import { banUserAction } from '@/actions/users/ban-user'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { UsersColumnType } from './users-table-types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { banUserSchema, type BanUserData } from '@/lib/schemas/user'

interface BanUserDialogProps {
  user: UsersColumnType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BanUserDialog({
  user,
  open,
  onOpenChange,
}: BanUserDialogProps) {
  const form = useForm<BanUserData>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      userId: user.id,
      banReason: '',
    },
  })

  async function onSubmit(data: BanUserData) {
    console.log(data)
    const response = await banUserAction(data)
    if (response.success) {
      toast.success('Usuário banido com sucesso')
      onOpenChange(false)
      form.reset()
    } else {
      toast.error(response.error?.message || 'Erro ao banir usuário')
    }
  }

  return (
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Banir Usuário"
      description={`Tem certeza que deseja banir o usuário "${user.name}"?`}
    >
      <div className="space-y-4">
        <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
          <p className="text-sm text-destructive">
            <strong>Atenção:</strong> O usuário será banido permanentemente e
            todas as suas sessões ativas serão revogadas. Esta ação pode ser
            revertida posteriormente.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="banReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do banimento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descreva o motivo do banimento..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  form.reset()
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Banir Usuário
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </BasicDialog>
  )
}
