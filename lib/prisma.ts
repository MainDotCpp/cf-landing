import { PrismaClient } from './generated/prisma'

declare global {

  var __PRISMA__: PrismaClient | undefined
}

export const prisma: PrismaClient = global.__PRISMA__ ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__PRISMA__ = prisma
}
