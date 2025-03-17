FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Dodaj diagnostykę podczas budowania
RUN ls -la && npm run build && ls -la dist/test-manager/

FROM nginx:alpine
# Skopiuj z podkatalogu 'browser'
COPY --from=build /app/dist/test-manager/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Dodaj polecenie, które wyświetli zawartość docelowego katalogu dla debugowania
RUN ls -la /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
