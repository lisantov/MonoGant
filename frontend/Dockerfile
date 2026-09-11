FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --include=dev

COPY . .

EXPOSE 5173

CMD ["sh", "-c", "exec npm run dev -- --host 0.0.0.0 --port ${PORT:-5173}"]
