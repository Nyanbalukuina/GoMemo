# 1.24 から 1.26 以上に変更
FROM golang:1.26-alpine

ARG http_proxy
ARG https_proxy
ENV http_proxy=$http_proxy
ENV https_proxy=$https_proxy
ENV GOPROXY=direct

# gitを追加
RUN apk add --no-cache git

WORKDIR /app

# これで通るはずです
RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["air"]