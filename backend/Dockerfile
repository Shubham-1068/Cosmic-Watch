FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN npm install --omit=dev
RUN npx prisma generate

COPY . .

RUN chmod +x ./docker-entrypoint.sh

ENV NODE_ENV=production
EXPOSE 8000

CMD ["./docker-entrypoint.sh"]
