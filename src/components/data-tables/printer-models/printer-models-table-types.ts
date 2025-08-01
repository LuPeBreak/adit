import type { Row } from '@tanstack/react-table'

export type PrinterModelsColumnType = {
  id: string
  name: string
  toners: string[]
  _count: {
    printers: number
  }
}

export interface PrinterModelRowActionsProps {
  row: Row<PrinterModelsColumnType>
}
