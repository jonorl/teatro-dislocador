# Dockerfile
FROM node:22-alpine

WORKDIR /app

# Copy dependency configs first to leverage Docker cache layers
COPY package*.json ./
RUN npm install

# Copy the rest of your server files
COPY . .

# Generate the Prisma client before execution
RUN DATABASE_URL_DISLOCADOR="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

EXPOSE 3000

# Use npx tsx to execute your entrypoint file directly from the src directory
CMD ["npx", "tsx", "src/app.ts"]