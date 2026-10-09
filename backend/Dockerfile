FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package.json ./

# npm install normal ahora instala TODO porque prisma, tsx y typescript están en dependencies
RUN npm install --legacy-peer-deps

COPY . .

# Ahora prisma SÍ está disponible
RUN npx prisma generate

RUN chmod +x entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["sh", "entrypoint.sh"]