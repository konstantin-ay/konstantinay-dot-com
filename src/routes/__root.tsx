/// <reference types="vite/client" />
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
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
})

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
        <Scripts />
      </body>
    </html>
  )
}
