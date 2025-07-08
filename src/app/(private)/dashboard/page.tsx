import SignOutButton from '@/components/auth/sign-out-button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })

  return (
    <div className="flex-1 flex flex-col gap-4 items-center justify-center ">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {session && (
        <div className="border-2 p-2 rounded-md flex flex-col items-center gap-2">
          <p>Nome: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <SignOutButton />
        </div>
      )}
    </div>
  )
}
