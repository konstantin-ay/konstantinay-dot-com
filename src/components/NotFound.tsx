import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main className='relative flex min-h-dvh w-full flex-col items-start justify-center overflow-hidden p-6 md:p-12'>
      <div className='max-w-[min(900px,100%)] text-center md:text-left'>
        <h1 className='fade-up fade-up-0 select-none font-sans font-bold tracking-[-0.035em] leading-[0.95] text-fg text-[clamp(1.75rem,8vw,6rem)]'>
          404
        </h1>
        <p className='fade-up fade-up-1 mt-3 max-w-[640px] text-base text-muted md:mt-8 md:text-lg'>
          This page doesn't exist.{' '}
          <Link to='/' className='underline underline-offset-4 hover:text-fg'>
            Head back home
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
