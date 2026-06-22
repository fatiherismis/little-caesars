// Tek bir Prisma Client örneği (singleton).
// Next.js geliştirme modunda hot-reload sırasında birden fazla bağlantı
// açılmasını önlemek için global üzerinde saklanır.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
