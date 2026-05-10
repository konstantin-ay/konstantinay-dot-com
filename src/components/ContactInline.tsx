import { Fragment } from 'react'
import { type ContactKind, content } from '../lib/content'

const URLS: Record<ContactKind, string> = {
  linkedin: content.links.linkedin,
  email: content.links.email,
  github: content.links.github,
  cv: content.cv.path,
}

const EXTERNAL: Record<ContactKind, boolean> = {
  linkedin: true,
  email: false,
  github: true,
  cv: false,
}

export function ContactInline() {
  const { intro, parts, separators } = content.contactSentence

  return (
    <>
      {intro}
      {parts.map((part, i) => {
        const sep = i === 0 ? '' : i === 1 ? separators.default : separators.beforeLast
        const url = URLS[part.kind]
        const isExternal = EXTERNAL[part.kind]
        const isCv = part.kind === 'cv'
        return (
          <Fragment key={part.kind}>
            {sep}
            <a
              href={url}
              {...(isCv ? { download: content.cv.downloadAs } : {})}
              {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className='text-[var(--color-link)] underline decoration-[var(--color-rule)] decoration-1 underline-offset-4 transition-colors duration-150 hover:text-[var(--color-link-hover)] hover:decoration-current'
            >
              {part.label}
            </a>
          </Fragment>
        )
      })}
      {separators.terminator}
    </>
  )
}
