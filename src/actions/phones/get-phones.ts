'use server'

import { withPermissions } from '@/lib/auth/with-permissions'
import prisma from '@/lib/prisma'
import {
  createSuccessResponse,
  createErrorResponse,
  type ActionResponse,
} from '@/lib/types/action-response'
import type { PhonesColumnType } from '@/components/data-tables/phones/phones-table-types'

export const getPhones = withPermissions(
  [{ resource: 'phone', action: ['list'] }],
  async (): Promise<ActionResponse<PhonesColumnType[]>> => {
    try {
      const phones = await prisma.phone.findMany({
        select: {
          id: true,
          phoneNumber: true,
          brand: true,
          phoneType: true,
          ipAddress: true,
          serialNumber: true,
          createdAt: true,
          updatedAt: true,
          asset: {
            select: {
              id: true,
              tag: true,
              status: true,
              sectorId: true,
              sector: {
                select: {
                  name: true,
                  department: {
                    select: {
                      acronym: true,
                    },
                  },
                },
              },
              statusHistory: {
                select: {
                  createdAt: true,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              },
            },
          },
        },
        orderBy: {
          asset: {
            tag: 'asc',
          },
        },
      })

      const formattedPhones = phones.map((phone) => {
        return {
          id: phone.id,
          phoneNumber: phone.phoneNumber,
          brand: phone.brand,
          phoneType: phone.phoneType,
          ipAddress: phone.ipAddress,
          serialNumber: phone.serialNumber,
          assetId: phone.asset.id,
          tag: phone.asset.tag,
          status: phone.asset.status,
          sectorId: phone.asset.sectorId,
          sector: phone.asset.sector.name,
          department: phone.asset.sector.department.acronym,
          createdAt: phone.createdAt,
          updatedAt: phone.updatedAt,
          lastStatusUpdate:
            phone.asset.statusHistory[0]?.createdAt || phone.createdAt,
        }
      })

      return createSuccessResponse(formattedPhones)
    } catch (error) {
      console.error('Erro ao buscar telefones:', error)
      return createErrorResponse('Erro interno do servidor')
    }
  },
)
