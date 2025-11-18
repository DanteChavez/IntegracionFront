# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json for dependency installation
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve with HTTPS using custom Express server
FROM node:20-alpine

WORKDIR /app

# Install Express for custom server
RUN npm install express

# Copy the build output from the previous stage
COPY --from=build /app/build ./build

# Copy SSL certificates from the local secrets folder
COPY --from=build /app/secrets /app/secrets

# Copy custom SPA server
COPY spa-server.js ./

# Expose port 3001 for HTTPS
EXPOSE 3001

# Start the custom HTTPS server with SPA routing support
CMD ["node", "spa-server.js"]
