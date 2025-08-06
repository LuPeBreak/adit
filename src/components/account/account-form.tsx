'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import {
  updateOwnProfileSchema,
  type UpdateOwnProfileData,
} from '@/lib/schemas/user'
import { Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth/auth-client'

interface AccountFormProps {
  user: {
    id: string
    name: string
    email: string
  }
}

export function AccountForm({ user }: AccountFormProps) {
  const profileForm = useForm<UpdateOwnProfileData>({
    resolver: zodResolver(updateOwnProfileSchema),
    defaultValues: {
      name: user.name,
    },
  })

  const onSubmitProfile = async (data: UpdateOwnProfileData) => {
    try {
      const result = await authClient.updateUser({ name: data.name })

      if (!result.error) {
        toast.success('Perfil atualizado com sucesso!')
        window.location.reload()
      } else {
        toast.error(result.error?.message || 'Erro ao atualizar perfil')
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro interno ao atualizar perfil')
    }
  }

  return (
    <Form {...profileForm}>
      <form
        onSubmit={profileForm.handleSubmit(onSubmitProfile)}
        className="space-y-4"
      >
        <FormField
          control={profileForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={user.email}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            O email não pode ser alterado.
          </p>
        </div>

        <Button
          type="submit"
          disabled={
            profileForm.formState.isSubmitting || !profileForm.formState.isDirty
          }
        >
          {profileForm.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Salvar Alterações
        </Button>
      </form>
    </Form>
  )
}
