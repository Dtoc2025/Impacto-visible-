FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9

COPY package.json ./
RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm prisma generate

# Dar permisos al entrypoint
RUN chmod +x entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./entrypoint.sh"]