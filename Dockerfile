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

# Nueva línea (crea /build)
RUN npm run build

# Copia el build a un directorio que NO será sobreescrito por el volumen
RUN mkdir -p /static-build && cp -r build/* /static-build/

# Instala express
RUN npm install express

# --- Dejas tu puerto original (por registro) ---
EXPOSE 3001

# --- Nuevo puerto real que usa el frontend dentro del contenedor ---
EXPOSE 6060

# Ejecutar tu servidor HTTPS personalizado
CMD ["node", "spa-server.js"]