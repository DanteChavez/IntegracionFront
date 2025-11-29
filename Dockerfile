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

# Exponer el puerto del frontend (3001)
EXPOSE 3001

# Comando por defecto
CMD ["npm", "start"]