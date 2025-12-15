# 1. Imagen base ligera
FROM node:18-alpine

# 2. Carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar archivos de dependencias
COPY package*.json ./

# 4. Instalar dependencias (limpio y rápido)
RUN npm ci --only=production

# 5. IMPORTANTE: Copiar TODO el código actual al contenedor
# (Aquí estaba el error, antes decía "COPY src ./src")
COPY . .

# 6. Puerto que usa tu app
EXPOSE 4000

# 7. Comando de inicio (asegúrate que en package.json tengas el script "start")
CMD ["npm", "start"]