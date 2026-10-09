#!/bin/sh
set -e

echo " Aplicando migraciones de Prisma..."
./node_modules/.bin/prisma migrate deploy

echo " Verificando si la base de datos ya tiene datos..."
USER_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.count()
  .then(c => { process.stdout.write(String(c)); process.exit(0); })
  .catch(() => { process.stdout.write('0'); process.exit(0); })
  .finally(() => prisma.\$disconnect());
" 2>/dev/null)

echo "  → Usuarios en DB: [$USER_COUNT]"

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo " Base de datos vacía, ejecutando seed..."
  ./node_modules/.bin/tsx prisma/seed.ts
  echo " Seed completado."
else
  echo " Base de datos ya tiene datos, saltando seed."
fi

echo " Iniciando backend..."
exec ./node_modules/.bin/tsx watch src/server.ts