FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN corepack enable
RUN pnpm install --no-frozen-lockfile --config.strict-peer-dependencies=false

COPY frontend ./
RUN npm run build

FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package.json ./
COPY backend/prisma ./prisma
RUN npm install --omit=dev
RUN npx prisma generate

COPY backend ./

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-builder /app/frontend/next.config.mjs ./frontend/next.config.mjs
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules

COPY --from=backend-builder /app/backend ./backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]
