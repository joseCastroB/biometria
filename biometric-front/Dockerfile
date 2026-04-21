# Etapa 1: Construcción
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Creamos la versión de producción
RUN npm run build

# Etapa 2: Servidor de Producción
FROM nginx:stable-alpine
# Copiamos el build a la carpeta de Nginx
COPY --from=build /app/build /usr/share/nginx/html
# Exponemos el puerto estándar de HTTP
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]