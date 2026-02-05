FROM node:23-slim

WORKDIR /app

# Install required dependencies for MongoDB Memory Server
RUN apt-get update && \
    apt-get install -y \
    wget \
    libcurl4 \
    libssl3 \
    && rm -rf /var/lib/apt/lists/* && \
    corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add lmwn-assignment-2025-server@0.0.0-beta.1

EXPOSE 8888 9999 7777

CMD ["node", "node_modules/lmwn-assignment-2025-server/main.js"]