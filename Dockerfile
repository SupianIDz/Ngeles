# Stage 1: Build Frontend
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the Vite frontend to the "dist" directory
RUN bun run build

# Stage 2: Production Runtime
FROM oven/bun:latest

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy only what we need from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY --from=builder /app/server ./server
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Expose the application port
EXPOSE 3000

# Start the Fastify + Bun server
CMD ["bun", "run", "server"]
