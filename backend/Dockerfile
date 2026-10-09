FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9

COPY package.json ./

# Forzar instalación de TODAS las dependencias (incluye devDependencies)
RUN pnpm install --no-frozen-lockfile --prod=false

COPY . .

# Verificar que prisma está instalado antes de generar
RUN pnpm exec prisma --version

# Generar Prisma Client
RUN pnpm exec prisma generate

RUN chmod +x entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]