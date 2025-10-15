import { HeroSection } from '@/components/home/hero-section'
import { ServicesSection } from '@/components/home/services-section'
import { AboutSection } from '@/components/home/about-section'
import { ContactSection } from '@/components/home/contact-section'
import { FooterSection } from '@/components/home/footer-section'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Background decorativo */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <FooterSection />
    </div>
  )
}
