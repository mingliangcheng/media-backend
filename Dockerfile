FROM node:23

WORKDIR /app

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/main"]