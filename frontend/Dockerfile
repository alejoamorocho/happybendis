# Etapa de desarrollo
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Iniciar el servidor de desarrollo de Vite
CMD ["npm", "run", "dev", "--", "--host"]
