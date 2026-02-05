# Build stage
FROM node:23-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY shared ./shared
COPY api-gateway ./api-gateway

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm --filter @shared/packages build

# Build API Gateway
RUN pnpm --filter api-gateway build

# Production stage
FROM node:23-alpine AS runner
WORKDIR /app

# Install curl and wget for health checks
RUN apk add --no-cache curl wget

# Copy built files directly from builder
COPY --from=builder /app/api-gateway/dist ./dist
COPY --from=builder /app/api-gateway/package.json ./package.json

# Copy node_modules from root (includes all dependencies)
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "dist/index.cjs"]