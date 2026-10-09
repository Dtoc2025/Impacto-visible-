#!/bin/sh
set -e

echo " Aplicando migraciones de Prisma..."
pnpm prisma migrate deploy

echo " Verificando si la base de datos ya tiene datos..."
USER_COUNT=$(pnpm prisma db execute --stdin <<EOF 2>/dev/null | tail -1 || echo "0"
SELECT COUNT(*) FROM users;
EOF
)

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
  echo " Base de datos vacía, ejecutando seed..."
  pnpm prisma db seed
else
  echo " Base de datos ya tiene datos, saltando seed."
fi

echo " Iniciando backend..."
exec pnpm dev