FROM node:22-alpine

# 引数を受け取る
ARG http_proxy
ARG https_proxy
ENV http_proxy=$http_proxy
ENV https_proxy=$https_proxy

# Alpine Linuxでは apk を使用。apk upgrade でOSの脆弱性を最小限にする
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

# プロキシ設定を反映させてインストール
RUN npm install && \
    npm install @next/swc-linux-x64-musl

COPY . .
CMD ["npm", "run", "dev"]