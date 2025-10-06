import { PrismaClient } from '../lib/generated/prisma/index.js'

const prisma = new PrismaClient()

function normalizeHost(host) {
  return (host ?? '').toLowerCase().trim()
}

function normalizePath(pathname) {
  const raw = (pathname ?? '/').trim()
  if (!raw || raw === '/')
    return '/'
  const stripped = raw.replace(/\/+$/, '')
  return stripped.length === 0 ? '/' : stripped
}

async function main() {
  const entries = [
    { host: 'localhost:3000', path: '/' },
    { host: 'localhost:3001', path: '/' },
  ]

  for (const e of entries) {
    const host = normalizeHost(e.host)
    const path = normalizePath(e.path)
    await prisma.urlConfig.upsert({
      where: { host_path: { host, path } },
      update: {
        pageInternal: '/',
      },
      create: {
        host,
        path,
        pageInternal: '/',
        ctas: { primary: '/contact', secondary: 'https://example.com' },
        analyticsSnippet: {
          headHtml: '',
          bodyStartHtml: '',
          bodyEndHtml: '',
        },
      },
    })
    console.log('Seeded url config for', host, path)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
