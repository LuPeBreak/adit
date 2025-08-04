'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { signInAction } from '../../actions/auth/sign-in'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function SignInForm() {
  const prevState = { errorMessage: '', fieldErrors: {} }

  const [state, formAction, pending] = useActionState(signInAction, prevState)

  useEffect(() => {
    if (state.errorMessage && !state.fieldErrors) {
      toast.error(state.errorMessage)
    }
  }, [state.errorMessage, state.fieldErrors])

  return (
    <form
      action={formAction}
      className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-8 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
    >
      <div>
        <h1 className="mb-1 mt-4 text-xl font-semibold">Fazer Login</h1>
        <p className="text-sm">Bem vindo de volta! Faça login para continuar</p>
      </div>

      <hr className="my-4 border-dashed" />

      <div className="space-y-6">
        <div>
          <Label htmlFor="email" className="text-sm">
            Email
          </Label>
          <Input type="email" required name="email" id="email" />
          {state.fieldErrors?.email && (
            <p className="text-sm text-red-500">{state.fieldErrors.email[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-sm">
            Senha
          </Label>
          <Input
            type="password"
            required
            name="password"
            id="password"
            className="input sz-md variant-mixed"
          />
          {state.fieldErrors?.password && (
            <p className="text-sm text-red-500">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>
        <Button
          className="w-full text-foreground"
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? 'Entrando' : 'Entrar'}
        </Button>
      </div>
    </form>
  )
}
