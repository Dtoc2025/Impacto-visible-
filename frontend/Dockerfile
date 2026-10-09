FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json ./
RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 4200

CMD ["pnpm", "start", "--host", "0.0.0.0", "--poll", "2000"]