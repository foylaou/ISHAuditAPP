# 基礎階段
FROM node:18-alpine AS base

# 依賴階段
FROM base AS deps
WORKDIR /app

# 複製依賴文件
COPY package.json /

# 安裝依賴
RUN apk add --no-cache libc6-compat
RUN yarn install --network-timeout 1000000

# 構建階段
FROM base AS builder
WORKDIR /app

# 複製依賴
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 設置構建參數和環境變數
ARG NODE_ENV
ARG API
ARG RAG_API
ARG NEXT_PUBLIC_DOMAIN

ENV NODE_ENV=${NODE_ENV}
ENV API_URL=${API_URL}
ENV RAG_API=${RAG_API}
ENV NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN}

# 構建應用
RUN yarn build

# 運行階段
FROM node:18-alpine AS runner
WORKDIR /app

# 安裝運行時所需的工具
RUN apk add --no-cache curl wget

# 設置環境變數
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 創建非 root 用戶和確保快取目錄可寫
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    mkdir -p /home/nextjs/.cache/yarn && \
    chown -R nextjs:nodejs /home/nextjs/.cache

# 複製 builder 階段的輸出
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# 設置健康檢查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -fsS -X GET http://localhost:3000/proxy/health || exit 1

# 切換到非 root 用戶
USER nextjs

# 開放端口
EXPOSE 3000

# 啟動命令
CMD ["yarn", "start"]
