'use client'

import { useState } from 'react'
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
  changeOwnPasswordSchema,
  type ChangeOwnPasswordData,
} from '@/lib/schemas/user'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authClient } from '@/lib/auth/auth-client'

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const passwordForm = useForm<ChangeOwnPasswordData>({
    resolver: zodResolver(changeOwnPasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  })

  const onSubmitPassword = async (data: ChangeOwnPasswordData) => {
    try {
      const result = await authClient.changePassword({ ...data })

      if (!result.error) {
        toast.success('Senha alterada com sucesso!')
        passwordForm.reset()
      } else {
        // Se o erro for na senha atual, focar no campo
        if (result.error?.code === 'INVALID_PASSWORD') {
          toast.error('Senha atual incorreta')
          passwordForm.setFocus('currentPassword')
          return
        }

        toast.error(result.error?.message || 'Erro ao alterar senha')
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      toast.error('Erro interno ao alterar senha')
    }
  }

  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
        className="space-y-4"
      >
        <FormField
          control={passwordForm.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Atual</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha atual"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Digite sua nova senha"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                A senha deve ter no mínimo 8 caracteres.
              </p>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            passwordForm.formState.isSubmitting ||
            !passwordForm.formState.isDirty
          }
        >
          {passwordForm.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Alterar Senha
        </Button>
      </form>
    </Form>
  )
}
