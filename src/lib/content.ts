export const content = {
  fullName: 'Konstantin Ay',
  role: 'Fullstack Developer',
  location: 'Gothenburg, Sweden',
  bio: 'Fullstack Developer based in Gothenburg, Sweden.',
  email: 'hello@konstantinay.com',
  cv: { path: '/konstantin-ay-cv.pdf', downloadAs: 'konstantin-ay-cv.pdf' },
  links: {
    linkedin: 'https://www.linkedin.com/in/konstantin-ay/',
    github: 'https://github.com/konstantin-ay',
    email: 'mailto:hello@konstantinay.com',
  },
  contactSentence: {
    intro: 'Add me on ',
    parts: [
      { label: 'Linkedin', kind: 'linkedin' },
      { label: 'email', kind: 'email' },
      { label: 'GitHub', kind: 'github' },
      { label: 'download my CV', kind: 'cv' },
    ],
    separators: { default: ', ', beforeLast: ' or ', terminator: '.' },
  },
  typewriter: {
    prefix: "I'm ",
    attempts: ['Konny?', 'Konstantni', 'Konstantine', 'Kostantin', 'Konntantin'],
    final: 'Konstantin :)',
    shuffle: true,
  },
  seo: {
    title: 'Konstantin Ay',
    description: 'Fullstack Developer based in Gothenburg, Sweden.',
    siteUrl: 'https://www.konstantinay.com',
    ogImage: '/og-image.png',
    locale: 'en_US',
    twitterHandle: '',
  },
} as const

export type Content = typeof content
export type ContactKind = (typeof content.contactSentence.parts)[number]['kind']
