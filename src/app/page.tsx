import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ResumeAnalysis from '@/components/ResumeAnalysis'

export default function Home() {
  return (
    <main className="bg-dark min-h-screen">
      <Header />
      <Hero />
      <ResumeAnalysis />
      <Features />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
} 