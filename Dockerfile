# Etapa base: Node 20
FROM node:20

# Crear carpeta de la app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

<<<<<<< HEAD
# Exponer el puerto del frontend (3001)
EXPOSE 3001
=======
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

# Expose port 6060 for HTTPS
EXPOSE 6060
>>>>>>> 7eb7640ef04230f21418407e2a1a292e34f4e1de

# Comando por defecto
CMD ["npm", "start"]
