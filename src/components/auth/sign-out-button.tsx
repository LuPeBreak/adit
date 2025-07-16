'use client'

import { authClient } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

export default function SignOutButton() {
  const router = useRouter()
  return (
    <Button
      className="w-full"
      variant={'destructive'}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/')
            },
          },
        })
      }}
    >
      Sair
    </Button>
  )
}
