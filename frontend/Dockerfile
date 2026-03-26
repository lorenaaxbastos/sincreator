FROM dhi.io/node:25-alpine3.23-dev AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

COPY frontend/package.json ./frontend/

RUN --mount=type=cache,target=/root/.npm npm ci

COPY frontend/ ./frontend/

WORKDIR /app/frontend

RUN npm run build

FROM dhi.io/nginx:1.29-alpine3.23-dev

COPY frontend/nginx.conf /etc/nginx/nginx.conf

COPY --chown=nginx:nginx --from=builder /app/frontend/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]

CMD ["-g", "daemon off;"]
