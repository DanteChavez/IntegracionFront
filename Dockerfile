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

# Stage 2: Serve with HTTPS using http-server
FROM node:20-alpine

WORKDIR /app

# Install http-server with SSL support
RUN npm install -g http-server

# Copy the build output from the previous stage
COPY --from=build /app/build ./build

# Copy SSL certificates from the local secrets folder
COPY --from=build /app/secrets /app/secrets

# Expose port 3001 for HTTPS
EXPOSE 3001

# Serve with HTTPS using the certificates
CMD ["http-server", "build", "-p", "3001", "-S", "-C", "/app/secrets/pulgashopcert.pem", "-K", "/app/secrets/pulgashopkey.pem"]
