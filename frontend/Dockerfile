FROM node:20-alpine

# 引数を受け取る
ARG http_proxy
ARG https_proxy
ENV http_proxy=$http_proxy
ENV https_proxy=$https_proxy

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

# 環境変数のプロキシを使って npm install
RUN npm install && \
    npm install @next/swc-linux-x64-musl

COPY . .
CMD ["npm", "run", "dev"]