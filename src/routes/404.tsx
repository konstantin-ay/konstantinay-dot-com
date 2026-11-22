import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'

// Prerendered to /404.html (see vite.config.ts) so static hosts like GitHub
// Pages can serve it for unknown paths. On the client the router then matches
// the real URL and renders the root notFoundComponent, which is the same component.
export const Route = createFileRoute('/404')({
  head: () => ({
    meta: [{ title: 'Page not found' }, { name: 'robots', content: 'noindex' }],
  }),
  component: NotFound,
})
