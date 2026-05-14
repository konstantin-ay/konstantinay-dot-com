import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/Hero'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main className='relative flex min-h-dvh w-full flex-col items-start justify-center overflow-hidden p-6 md:justify-end md:p-12'>
      <section className='relative z-10 w-full'>
        <Hero />
      </section>
    </main>
  )
}
