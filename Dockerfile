FROM oven/bun:1.2.10
WORKDIR /app

# Generate Prisma WASM client at build time
ENV PRISMA_CLIENT_ENGINE_TYPE=wasm

# Install deps using the lockfile
COPY bun.lockb* package.json ./
RUN bun install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN bunx prisma generate

EXPOSE 3000
CMD ["bun", "src/index.ts"]
