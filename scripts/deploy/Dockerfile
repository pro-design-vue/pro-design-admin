FROM node:22 AS builder

# --max-old-space-size
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai
ENV LEFTHOOK=0

WORKDIR /app

# copy manifests first to leverage the docker layer cache
COPY package.json package-lock.json ./

# 安装依赖
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci --no-audit --no-fund

COPY . /app

RUN npm run build

RUN echo "Builder Success 🎉"

FROM nginx:alpine AS production
ENV API_BASE_PATH http://127.0.0.1:3000

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
# COPY --from=builder /app/scripts/deploy/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/scripts/deploy/nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
