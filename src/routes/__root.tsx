/// <reference types="vite/client" />
import { PostHogProvider } from '@posthog/react'
import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { CursorSpotlight } from '../components/CursorSpotlight'
import { NotFound } from '../components/NotFound'
import { content } from '../lib/content'
import { buildHead } from '../lib/seo'
import appCss from '../styles/app.css?url'

const posthogToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST
const posthogEnabled = Boolean(posthogToken && posthogHost)

if (!posthogEnabled && import.meta.env.DEV && typeof window !== 'undefined') {
  for (const variable of [
    !posthogToken && 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN',
    !posthogHost && 'VITE_PUBLIC_POSTHOG_HOST',
  ]) {
    if (variable) {
      console.error(
        new Error(
          `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
        ),
      )
    }
  }
}

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
      </head>
      <body>
        {posthogEnabled ? (
          <PostHogProvider
            apiKey={posthogToken!}
            options={{
              api_host: posthogHost,
              capture_exceptions: true,
              debug: import.meta.env.DEV,
              logs: {
                serviceName: 'konstantinay-dot-com',
                environment: import.meta.env.MODE,
              },
            }}
          >
            {children}
            <CursorSpotlight />
          </PostHogProvider>
        ) : (
          <>
            {children}
            <CursorSpotlight />
          </>
        )}
        <Scripts />
      </body>
    </html>
  )
}
