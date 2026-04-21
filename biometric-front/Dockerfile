# Etapa 1: Construcción
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Creamos la versión de producción
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:stable-alpine

# Copiamos nuestro config personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copiamos los archivos de React
COPY --from=build /app/build /usr/share/nginx/html

# Comando mágico para inyectar el puerto de Railway antes de iniciar
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]