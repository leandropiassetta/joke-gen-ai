FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/build ./build
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
COPY ace.js .

RUN chmod +x /app/entrypoint.sh

EXPOSE 3333

ENTRYPOINT ["/app/entrypoint.sh"]
