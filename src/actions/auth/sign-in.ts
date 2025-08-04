'use server'

import { auth } from '@/lib/auth/auth'
import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'
import z from 'zod'

interface SignInActionState {
  errorMessage?: string | null
  fieldErrors?: {
    email?: string[]
    password?: string[]
  }
}

const signInSchema = z.object({
  email: z
    .string({ message: 'Email Obrigatório.' })
    .email({ message: 'Email inválido.' }),
  password: z
    .string({ message: 'Senha Obrigatória.' })
    .min(6, { message: 'Senha inválida.' }),
})

export async function signInAction(
  prevState: SignInActionState,
  formData: FormData,
) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors
    return { errorMessage: 'Email ou senha inválidos.', fieldErrors }
  }

  const { email, password } = validatedFields.data

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    })
  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case 'UNAUTHORIZED':
          return { errorMessage: 'Email ou senha inválidos.' }
        default:
          return { errorMessage: 'Algo deu errado.' }
      }
    }
    console.error('signIn error:', error)
  }

  redirect('/dashboard')
}
