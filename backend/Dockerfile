FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar el package.json Y el schema antes de instalar (así la caché se invalida cuando cambian)
COPY package.json ./
COPY prisma ./prisma

# Instalar dependencias (incluye prisma en dependencies)
RUN npm install --legacy-peer-deps

# Ahora copiar el resto del código
COPY . .

# Verificar que prisma esté instalado
RUN ./node_modules/.bin/prisma --version

# Generar Prisma Client usando el binario LOCAL (evita npx descargando otra versión)
RUN ./node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

RUN chmod +x entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["sh", "entrypoint.sh"]