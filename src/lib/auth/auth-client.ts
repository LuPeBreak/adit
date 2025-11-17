import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'
import {
  ac,
  ADMIN,
  OPERATOR_ORG,
  OPERATOR_ASSETS,
  OPERATOR_PRINTERS,
  OPERATOR_PHONES,
} from './permissions'

export const authClient = createAuthClient({
  plugins: [
    adminClient({
      ac,
      roles: {
        ADMIN,
        OPERATOR_ORG,
        OPERATOR_ASSETS,
        OPERATOR_PRINTERS,
        OPERATOR_PHONES,
      },
    }),
  ],
})
