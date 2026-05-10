import type { content as Content } from './content'

type HeadMeta = {
  name?: string
  property?: string
  content?: string
  charSet?: string
  title?: string
  media?: string
}
type HeadLink = { rel: string; href: string; type?: string; sizes?: string; media?: string }
type HeadScript = { type?: string; children?: string }

export function buildHead(content: typeof Content) {
  const { seo, fullName, role, location, links, email } = content
  const url = seo.siteUrl
  const ogImageUrl = seo.ogImage.startsWith('http') ? seo.ogImage : url + seo.ogImage

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName,
    url,
    email,
    jobTitle: role,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.split(',')[0]?.trim() ?? location,
      addressCountry: 'SE',
    },
    sameAs: [links.linkedin, links.github],
  }

  const meta: HeadMeta[] = [
    { charSet: 'utf-8' },
    { title: seo.title },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'description', content: seo.description },
    { name: 'author', content: fullName },
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: seo.title },
    { property: 'og:description', content: seo.description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: ogImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${fullName} — ${role}` },
    { property: 'og:locale', content: seo.locale },
    { property: 'og:site_name', content: fullName },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seo.title },
    { name: 'twitter:description', content: seo.description },
    { name: 'twitter:image', content: ogImageUrl },
    { name: 'twitter:image:alt', content: `${fullName} — ${role}` },
  ]

  const links_: HeadLink[] = [
    { rel: 'canonical', href: url },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
    { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
  ]

  const scripts: HeadScript[] = [
    {
      type: 'application/ld+json',
      children: JSON.stringify(personSchema),
    },
  ]

  return {
    meta,
    links: links_,
    scripts,
    title: seo.title,
  }
}
