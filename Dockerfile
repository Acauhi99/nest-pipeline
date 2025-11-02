# MULTI-STAGE BUILD
# ============================================
# STAGE 1: BUILD
# ============================================
FROM node:20-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

WORKDIR /app

# Copiar apenas arquivos de dependências primeiro
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm build

# ============================================
# STAGE 2: PRODUCTION
# ============================================
FROM node:20-alpine AS production

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Instalar wget para healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copiar apenas o necessário do builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Mudar para usuário não-root
USER nestjs

# Expor portas
EXPOSE 3000 50051

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Iniciar aplicação
CMD ["node", "dist/main.js"]
