# Build en dos etapas: Vite solo hace falta para compilar, no para servir. Lo
# que llega a producción es `dist/` más un `server.js` que no tiene ninguna
# dependencia, así que la imagen final no instala nada.
#
# Se usa Dockerfile y no Nixpacks a propósito, igual que en el portal de
# Ánfora: Nixpacks decide por su cuenta si instala las devDependencies, y aquí
# el build depende de ellas (vite y @vitejs/plugin-react son devDependencies).

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS run
ENV NODE_ENV=production
WORKDIR /app
# Nada de `npm install` aquí: server.js solo usa módulos `node:*`.
COPY --from=build /app/dist ./dist
COPY server.js package.json ./
EXPOSE 8099
CMD ["node", "server.js"]
