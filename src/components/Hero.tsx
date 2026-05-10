import { content } from '../lib/content'
import { ContactInline } from './ContactInline'
import { Typewriter } from './Typewriter'

export function Hero() {
  return (
    <div className='max-w-[min(900px,100%)]'>
      <h1 className='fade-up fade-up-0 font-sans font-medium tracking-[-0.035em] leading-[0.95] text-[var(--color-fg)] text-[clamp(2.5rem,11vw,8rem)]'>
        <Typewriter
          prefix={content.typewriter.prefix}
          attempts={content.typewriter.attempts}
          final={content.typewriter.final}
          shuffle={content.typewriter.shuffle}
        />
      </h1>

      <p className='fade-up fade-up-1 mt-6 max-w-[640px] text-base text-[var(--color-muted)] md:mt-8 md:text-lg'>
        {content.bio} <ContactInline />
      </p>
    </div>
  )
}
