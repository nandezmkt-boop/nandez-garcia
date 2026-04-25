import { GridBackground } from '@/components/ui/GridBackground'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CTAFinal } from '@/components/sections/CTAFinal'

export default function ContactoPage() {
  return (
    <>
      <GridBackground />
      <Navbar />
      <main className="relative z-10">
        <CTAFinal showUrgency />
      </main>
      <Footer />
    </>
  )
}
