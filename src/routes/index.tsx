import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/Hero'
import { ThemeToggle } from '../components/ThemeToggle'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main className='relative flex min-h-dvh w-full flex-col items-start justify-end overflow-hidden p-6 md:p-12'>
      <header className='absolute top-0 right-0 z-20 p-6 md:p-10'>
        <ThemeToggle />
      </header>

      <section className='relative z-10 w-full'>
        <Hero />
      </section>
    </main>
  )
}
