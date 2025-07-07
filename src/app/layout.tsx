import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ADIT',
  description: 'Sistema de Gestão de Ativos da TI PMBM',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  )
}
