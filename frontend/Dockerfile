FROM node:20-slim

WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package*.json ./

RUN npm ci

# Copy the rest of the source
COPY . .

# Expose Vite default dev port
EXPOSE 5173

ENV HOST=0.0.0.0

# Start the dev server; ensure Vite binds to 0.0.0.0 by passing --host
CMD ["sh", "-c", "PORT=${PORT:-5173} npm run dev -- --host 0.0.0.0"]

