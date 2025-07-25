export function FooterSection() {
  return (
    <footer className="py-8 px-6 border-t border-border max-h-20">
      <div className="container mx-auto max-w-6xl text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ADIT - Prefeitura Municipal de Barra
          Mansa. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
