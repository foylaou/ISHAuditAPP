# 基礎階段
FROM node:18-alpine AS base

# 依賴階段
FROM base AS deps
WORKDIR /app

# 安裝依賴所需的額外套件
RUN apk add --no-cache libc6-compat

# 複製依賴文件
COPY package.json yarn.lock ./

# 安裝依賴
RUN yarn install --production --network-timeout 1000000

# 構建階段
FROM base AS builder
WORKDIR /app

# 複製依賴
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 設置構建參數和環境變數
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_DOMAIN
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN}

# 構建應用
RUN yarn build

# 運行階段
FROM base AS runner
WORKDIR /app

# 安裝 `curl` 和 `wget`
RUN apk add --no-cache curl wget

# 設置運行時環境變數
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 建立非 root 用戶
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 複製必要文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# 複製並設置環境變數處理腳本
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 設置健康檢查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/proxy/health || exit 1

# 切換到非 root 用戶
USER nextjs

# 設置容器配置
EXPOSE 3000

# 設置入口點和啟動命令
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["yarn", "start"]
