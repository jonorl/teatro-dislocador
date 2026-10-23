FROM node:22-alpine

WORKDIR /app

# Copy dependency configs first to leverage Docker cache layers
COPY package*.json ./
RUN npm ci

# Copy the rest of your server files
COPY . .

# Set the environment variable globally for the build process
ENV DATABASE_URL_DISLOCADOR="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate the Prisma client before execution
RUN npx prisma generate

# The deploy passes the commit being built; /health reports it so the smoke test can tell the new container is live.
ARG GIT_SHA=dev
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

# Lets `docker ps` show whether the API can still reach its database. busybox wget ships with the alpine image.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT_DISLOCADOR:-3000}/health" > /dev/null || exit 1

# Use npx tsx to execute your entrypoint file directly from the src directory
CMD ["npx", "tsx", "src/app.ts"]