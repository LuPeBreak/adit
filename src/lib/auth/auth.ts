import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import prisma from '../prisma'
import { admin } from 'better-auth/plugins'
import {
  ac,
  ADMIN,
  OPERATOR_ORG,
  OPERATOR_ASSETS,
  OPERATOR_PRINTERS,
  OPERATOR_PHONES,
} from './permissions'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [
    nextCookies(),
    admin({
      adminRoles: ['ADMIN'],
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
