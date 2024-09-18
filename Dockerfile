# Stage 1: Base environment (common to all environments)
FROM node:18 AS base

WORKDIR /app

COPY package*.json ./

# Install dependencies only
RUN npm install

COPY . .

# Stage 2: Development environment
FROM base AS development

ENV NODE_ENV=development

# Install development dependencies
RUN npm install

# Expose the port for development
EXPOSE 3000

CMD ["npm", "run", "start"]  # Run the development server

# Stage 3: Production environment
FROM base AS production

ENV NODE_ENV=production

# Build the TypeScript code
RUN npm run build

# Clean up unnecessary files
RUN rm -rf node_modules && npm install --only=production

# Use a smaller final image for production
FROM node:18 AS final

WORKDIR /app

COPY --from=production /app /app

EXPOSE 3000

CMD ["node", "dist/server.js"]  # Start the production server

# Stage 4: Testing environment
FROM base AS test

WORKDIR /app

COPY . .

# Install testing dependencies
RUN npm install --only=development

# Run tests
CMD ["npm", "test --passWithNoTests"]