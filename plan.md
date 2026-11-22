# Rebuild konstantinay.com on a modern Vite/React/TS stack

## Context

The current konstantinay.com is a personal landing page with a typewriter intro that types `I'm Konst` once and then cycles a randomly-shuffled list of suffixes (`ana`, `antni`, `nat`, `annnnn`, `antttni`, `konny?`) before settling on the canonical `antin :)` — so the final phrase reads **"I'm Konstantin :)"**. Beneath it sits a one-line bio (*"Fullstack Developer based in Gothenburg, Sweden."*) and an inline link sentence pointing to LinkedIn, email, GitHub, and a downloadable CV. The current build is a Vite SPA with Poppins, a dark dotted-grid background, white text, no SSR, and PostHog click tracking.

This rebuild keeps the **exact same copy and spirit** but moves to a modern, type-safe, prerendered stack with proper SEO, an auto dark/light theme, and a new visual hook: the full name **"Konstantin Ay"** anchored in the bottom-left in large editorial serif.

The repo is currently empty (only `.git`, `.agents/`, and `skills-lock.json`) — this is a true greenfield rebuild, not an in-place upgrade. Hosting is deferred; static output deploys to anything.

**Goals**

- Same spirit and copy as today's site (typewriter hero, one-line bio + inline link sentence, single landing page) with a fresh layout.
- React 19 + TypeScript + Vite + Tailwind, as requested.
- Strong SEO: prerendered HTML for every route, proper meta/OG/Twitter/JSON-LD tags, sitemap, robots.
- Auto dark/light following `prefers-color-scheme` with a manual toggle.
- Big editorial-serif name in the bottom-left.
- Subtle motion only — entrance fades, hover transitions, theme animation.

---

## Stack decisions

| Concern | Pick | Why |
|---|---|---|
| Framework | **TanStack Start** (`@tanstack/react-start` v1.138+) | Vite-native React 19 meta-framework; type-safe routing; built-in **static prerendering** (Dec 2025+) → real HTML for SEO; same Vite tooling user requested; trivial to grow into more routes later |
| Language | **TypeScript** (strict) | requested |
| Build | **Vite 5+** (via TanStack Start) | requested; Start uses Vite under the hood |
| Styling | **Tailwind CSS v4** | Latest; CSS-first config (`@theme` in CSS), no `tailwind.config.js` needed; native Vite plugin `@tailwindcss/vite` |
| Icons | **lucide-react** | Tree-shaken React icons, dark/light friendly |
| Motion | **motion** (formerly Framer Motion) | Subtle entrance + hover animations only; lightweight |
| Fonts | **@fontsource-variable/fraunces** + **@fontsource-variable/inter** | Self-hosted variable fonts, no external font CDN, zero CLS, fast |
| Theme | **Custom hook + `<script>` blocker in `<head>`** | No flash of wrong theme; respects `prefers-color-scheme`; persists choice in `localStorage` |
| SEO meta | **TanStack Start `<HeadContent />` / `head` route option** | Native; declarative per-route head/meta/link/script |
| Lint/format | **Biome** | Single binary, fast, replaces ESLint + Prettier |
| Package mgr | **pnpm** | Fast, disk-efficient, locked via `pnpm-lock.yaml` |
| Node version | **22 LTS** | Pin via `.nvmrc` and `package.json#engines` |

**Not chosen / deliberately skipped**

- No CMS or MDX — single landing page only.
- No shadcn/ui — content is too small to justify the install; raw Tailwind is enough.
- No tests — landing page; visual smoke check is enough. Add Vitest later if needed.
- No `next-themes` — Next.js-only; we hand-roll a 20-line theme hook.

---

## Layout sketch (single viewport, responsive)

```
┌──────────────────────────────────────────────────────────────────┐
│                                              [☼/☾]          ◄ top bar (theme toggle only) │
│                                                                  │
│   I'm Konstana|                              ◄ typewriter hero   │
│   (prefix "I'm Konst" stays; suffix cycles randomly through      │
│    ana, antni, nat, annnnn, antttni, konny? → lands on "antin :)")│
│                                                                  │
│   Fullstack Developer based in                                   │
│   Gothenburg, Sweden.                        ◄ one-line bio      │
│                                                                  │
│   Add me on Linkedin, email or GitHub        ◄ inline link       │
│   or download my CV.                           sentence          │
│                                                                  │
│                                                                  │
│                                                                  │
│   Konstantin                                                     │
│   Ay                                         ◄ huge serif,       │
│                                                bottom-left,      │
│                                                clamp(80px,18vw,260px) │
└──────────────────────────────────────────────────────────────────┘
```

- Viewport: `min-h-dvh` with the name absolutely-positioned bottom-left.
- The hero column is left-aligned, max-width ~640px, ~`p-8 md:p-16` from the edges.
- The big name uses `font-serif` (Fraunces variable), tight tracking, `leading-[0.85]`, stacked on two lines on narrow screens.
- Theme toggle sits top-right (CV lives in the inline link sentence, matching the current site).
- Mobile: same composition; the big name shrinks via `clamp()`. No layout shift.

---

## File structure

```
konstantinay-dot-com/
├── .nvmrc                          # 22
├── .gitignore                      # node_modules, dist, .vite, .env*
├── biome.json                      # lint + format config
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts                  # TanStack Start plugin + tailwind plugin + prerender config
├── public/
│   ├── cv.pdf                      # placeholder; user drops their CV here
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── og-image.png                # 1200x630 social preview
│   └── robots.txt
├── src/
│   ├── styles/
│   │   └── app.css                 # Tailwind v4 + @theme tokens (light/dark CSS vars + serif font-family)
│   ├── lib/
│   │   ├── content.ts              # SINGLE source of truth: name, bio, links, misspellings, SEO copy
│   │   └── seo.ts                  # buildHead(): meta + OG + Twitter + JSON-LD Person schema
│   ├── hooks/
│   │   └── useTheme.ts             # 'system' | 'light' | 'dark', writes data-theme on <html>, syncs localStorage
│   ├── components/
│   │   ├── Typewriter.tsx          # accessibility-friendly typewriter (prefers-reduced-motion respected)
│   │   ├── ThemeToggle.tsx         # icon button cycling system → light → dark
│   │   ├── BigName.tsx             # bottom-left serif name
│   │   ├── Hero.tsx                # typewriter + bio + inline link sentence column
│   │   └── ContactLine.tsx         # "Add me on LinkedIn, email or GitHub or download my CV." inline links
│   └── routes/
│       ├── __root.tsx              # <html>, <head> (with no-flash theme script), TanStack Router devtools off in prod
│       └── index.tsx               # the landing page route; exports `head` for per-route SEO
└── README.md
```

Everything that the user will edit day-to-day lives in **one file**: `src/lib/content.ts`. Bio copy, social URLs, CV path, JSON-LD person fields, and the typewriter misspelling sequence all live there.

---

## Implementation steps

### 1. Scaffold (one shot)
- `pnpm create @tanstack/start@latest .` (template: React, TypeScript, no auth, no DB).
- Replace ESLint default with Biome: `pnpm add -D @biomejs/biome` and write `biome.json` (recommended rules; 2-space indent; single-quote JSX).
- Add `@tailwindcss/vite` and `tailwindcss@4`; wire into `vite.config.ts`.
- Pin Node 22 in `.nvmrc` and `package.json#engines`.
- Add fonts: `pnpm add @fontsource-variable/fraunces @fontsource-variable/inter`; import once in `src/styles/app.css`.

### 2. Theme system (no-flash)
- In `__root.tsx` `<head>`, inject a tiny inline `<script>` (string literal) that runs **before paint**: reads `localStorage.theme` (or `prefers-color-scheme`) and sets `document.documentElement.dataset.theme = 'dark'|'light'`. This is the standard no-flash pattern.
- `app.css` declares CSS variables under `:root[data-theme='light']` and `:root[data-theme='dark']`, then maps them into Tailwind v4 tokens via `@theme`.
- `useTheme.ts` exposes `{theme, resolvedTheme, setTheme}`; updates `<html data-theme>` and `localStorage`; listens to `matchMedia('(prefers-color-scheme: dark)')` when `theme === 'system'`.
- `ThemeToggle.tsx` cycles `system → light → dark` with a lucide icon.

### 3. Layout & big name
- `__root.tsx` renders an `<Outlet />` inside a `<main className="relative min-h-dvh ...">`.
- `routes/index.tsx` composes: `<TopBar />` (theme toggle only), `<Hero />` (typewriter + bio + `<ContactLine />`), `<BigName />`.
- `BigName.tsx`: absolutely positioned `bottom-0 left-0 p-6 md:p-10`, `font-serif`, `text-[clamp(72px,18vw,260px)]`, `leading-[0.85]`, `tracking-tight`. Stacks "Konstantin" / "Ay" on narrow screens.
- The big name MUST be selectable text and present in the prerendered HTML (good for SEO + accessibility — it's part of the H1 / main heading).

### 4. Typewriter hero
- `Typewriter.tsx` props: `prefix="I'm Konst"`, `attempts: string[]` (suffixes), `final="antin :)"`, `typeMs`, `eraseMs`, `pauseMs`, `shuffle: boolean`.
- Behavior: renders the static prefix `I'm Konst` once. For each suffix it types the suffix, pauses, backspaces back to the prefix, then types the next suffix. After the shuffled list it types `final` (`antin :)`) and stays — full phrase reads `I'm Konstantin :)`.
- The attempts list is **shuffled on each load** (Fisher–Yates) before the canonical final, mirroring the current site.
- Accessibility:
  - The full final phrase (`I'm Konstantin :)`) is rendered in the **server HTML** as a visually-hidden `<span>` so screen readers and crawlers see the canonical text.
  - The animated portion is `aria-hidden="true"`.
  - If `prefers-reduced-motion: reduce`, the typewriter renders the final text immediately and skips the cycle.
- Default suffixes (in `content.ts`, copied verbatim from the current site): `["ana", "antni", "nat", "annnnn", "antttni", "konny?"]` → final `"antin :)"`.

### 5. Content (`src/lib/content.ts`)
Copy below mirrors the live site verbatim — no TODOs left to fill in for the launch-equivalent build.
```ts
export const content = {
  fullName: "Konstantin Ay",
  firstName: "Konstantin",
  role: "Fullstack Developer",
  location: "Gothenburg, Sweden",
  bio: "Fullstack Developer based in Gothenburg, Sweden.",
  email: "hello@konstantinay.com",
  cv: { path: "/cv.pdf", downloadAs: "top-candidate.pdf" },
  links: {
    linkedin: "https://www.linkedin.com/in/konstantin-ay/",
    github:   "https://github.com/konstantin-ay",
    email:    "mailto:hello@konstantinay.com",
  },
  // Inline link sentence rendered after the bio, mirroring the current site.
  // Order matches today: LinkedIn, email, GitHub, then CV.
  contactSentence: {
    intro: "Add me on ",
    parts: [
      { label: "Linkedin",        kind: "linkedin" },
      { label: "email",           kind: "email"    },
      { label: "GitHub",          kind: "github"   },
      { label: "download my CV",  kind: "cv"       },
    ],
    // Renders as: "Add me on Linkedin, email or GitHub or download my CV."
    separators: { default: ", ", beforeLast: " or ", terminator: "." },
  },
  typewriter: {
    prefix: "I'm Konst",
    attempts: ["ana", "antni", "nat", "annnnn", "antttni", "konny?"],
    final: "antin :)", // full phrase: "I'm Konstantin :)"
    shuffle: true,
  },
  seo: {
    title: "Konstantin Ay",
    description: "Fullstack Developer based in Gothenburg, Sweden.",
    siteUrl: "https://www.konstantinay.com",
    ogImage: "/og-image.png",
  },
} as const;
```

### 6. SEO
- `src/lib/seo.ts` exports `buildHead(content)` returning a TanStack Router `head` object with:
  - `<title>`, `<meta name="description">`, `<link rel="canonical">`
  - Open Graph: `og:title`, `og:description`, `og:image`, `og:type=website`, `og:url`
  - Twitter: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
  - **JSON-LD `Person` schema** (`@context: https://schema.org`, `@type: Person`, `name`, `url`, `email`, `sameAs: [...socials]`, `jobTitle`)
  - `<meta name="theme-color">` per dark/light (`media="(prefers-color-scheme: dark)"` variant)
- `routes/index.tsx` exports `head: () => buildHead(content)`.
- `public/robots.txt`: allow all, point to `/sitemap.xml`.
- Static prerender outputs `index.html` with the final HTML (typewriter end-state visible to crawlers via the visually-hidden canonical text).
- Add `<link rel="icon" type="image/svg+xml" href="/favicon.svg">` and `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`.
- `og-image.png` (1200×630) initially placeholder; user replaces.

### 7. Static prerendering
- In `vite.config.ts`, configure TanStack Start `prerender: { enabled: true, crawlLinks: true }` so build outputs static HTML.
- `pnpm build` produces `.output/public/` (Nitro static target) ready to deploy as static assets to **any** host (Vercel, Cloudflare Pages, Netlify, S3+CloudFront, GitHub Pages with custom domain, or even a tarball to whatever currently serves the site).
- `pnpm preview` serves the prerendered output locally for verification.

### 8. Polish
- Subtle entrance: hero text + big name fade in with `motion`, ~300 ms, staggered, **disabled under `prefers-reduced-motion`**.
- Hover states on the inline link sentence (LinkedIn / email / GitHub / CV): underline + slight color shift.
- The CV anchor uses `download="top-candidate.pdf"` so the file saves under that name (preserved from the current site — it's an intentional joke).
- Selection color and focus rings tuned per theme.
- `lang="en"` on `<html>`.

---

## Verification (run before declaring done)

1. **Dev**: `pnpm dev` → open `http://localhost:3000`.
   - Typewriter cycles through the suffix misspellings (`ana`, `antni`, `nat`, `annnnn`, `antttni`, `konny?` — order varies per load) and lands on `I'm Konstantin :)`.
   - Big "Konstantin Ay" sits in bottom-left at all viewport sizes (resize 360 → 1920).
   - Theme toggle cycles `system → light → dark`; refresh shows **no FOUC** (no-flash script works).
   - `prefers-reduced-motion: reduce` (Chrome DevTools → Rendering → Emulate CSS media) makes the typewriter show `I'm Konstantin :)` immediately.
   - The inline link sentence reads exactly: *"Add me on Linkedin, email or GitHub or download my CV."* with each word linked.
   - Clicking "download my CV" downloads the file as `top-candidate.pdf`.
2. **Build**: `pnpm build` → confirms TanStack Start prerendered the route.
   - `cat .output/public/index.html | grep -i "konstantin"` finds the canonical name in the static HTML.
   - `cat .output/public/index.html | grep -i "application/ld+json"` finds the Person schema.
3. **Preview**: `pnpm preview` → manual smoke same as dev.
4. **SEO sanity**: `curl -s http://localhost:3000/ | grep -E '<title>|og:|twitter:|application/ld\+json'` shows all the expected tags in the prerendered HTML (not injected client-side).
5. **Lint/format**: `pnpm biome check .` clean.
6. **Lighthouse** (Chrome DevTools, mobile): aim Performance / Accessibility / Best Practices / SEO ≥ 95. The single static page should easily hit 100/100/100/100 with this stack.

---

## Open items the user owns after scaffold

- Copy the existing `cv.pdf` from the current deploy into `/public/` (or drop a fresh one).
- Replace `og-image.png`, `favicon.svg`, `apple-touch-icon.png` with real assets (the current site has no OG image, so this is a net-new SEO win).
- Decide whether to keep PostHog click tracking from the current site (`phc_xwXLD0PXp1X0MkO43fmSjFqCRNYp4ixCwCTqjSBdkGH`, events: `LINKEDIN`, `GITHUB`, `DOWNLOAD_CV`). If yes, add `posthog-js` and wire the same event names; if no, drop it — out of scope by default.
- Pick hosting (Vercel / Cloudflare Pages / Netlify / current host) and wire deploy. Static output works on all of them — no code changes needed when we choose.
- Optional copy upgrades vs. current site: longer bio, a "Twitter/X" link, or a projects section. None of these exist today; flag if you want them.
