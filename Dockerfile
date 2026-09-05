#  frontend builder
FROM node:24-alpine AS frontend-builder

COPY ./frontend /app

WORKDIR /app

RUN npm install
RUN npm run build

#  admin builder

FROM node:24-alpine AS admin-builder

COPY ./admin /app

WORKDIR /app

RUN npm install
RUN npm run build

# backend builder

FROM node:24-alpine AS backend-builder

COPY ./backend /app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist /app/public
COPY --from=admin-builder /app/dist /app/public

CMD ["node", "server.js"]