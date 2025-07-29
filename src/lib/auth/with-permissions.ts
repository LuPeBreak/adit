import { auth } from './auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Session as BetterAuthSession } from 'better-auth'
import type { UserWithRole } from 'better-auth/plugins/admin'
import type { PermissionOption } from './permissions'

export interface Session extends BetterAuthSession {
  user: UserWithRole
}

export function withPermissions<T, TArgs extends unknown[]>(
  options: PermissionOption[],
  callback: (session: Session, ...args: TArgs) => Promise<T>,
) {
  return async (...args: TArgs) => {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as Session | null

    if (!session) {
      return redirect('/login')
    }

    const permissions: Record<string, string[]> = {}

    options.forEach(({ resource, action = ['list'] }) => {
      permissions[resource] = action
    })

    const permissionCheck = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions,
      },
    })

    if (!permissionCheck.success) {
      return redirect('/dashboard')
    }

    return callback(session, ...args)
  }
}
