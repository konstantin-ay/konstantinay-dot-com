/// <reference types="vite/client" />
import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { CursorSpotlight } from '../components/CursorSpotlight'
import { content } from '../lib/content'
import { buildHead } from '../lib/seo'
import { NO_FLASH_THEME_SCRIPT } from '../hooks/useTheme'
import appCss from '../styles/app.css?url'

export const Route = createRootRoute({
  head: () => {
    const head = buildHead(content)
    return {
      meta: head.meta,
      links: [{ rel: 'stylesheet', href: appCss }, ...head.links],
      scripts: head.scripts,
    }
  },
  component: RootComponent,
  notFoundComponent: NotFound,
})

function NotFound() {
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

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
        {/* Theme-color tags rendered directly so React doesn't de-dupe by name attribute */}
        <meta name='theme-color' media='(prefers-color-scheme: light)' content='#fafafa' />
        <meta name='theme-color' media='(prefers-color-scheme: dark)' content='#0c0d12' />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted inline no-flash theme bootstrap
          dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }}
        />
      </head>
      <body>
        {children}
        <CursorSpotlight />
        <Scripts />
      </body>
    </html>
  )
}
