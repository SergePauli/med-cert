FROM node:12

# Добавляем сертификат прокси в доверенные
# только в случае использования прокси-сервера
ADD squid.crt /usr/local/share/ca-certificates
RUN update-ca-certificates


# создание директории приложения
WORKDIR /usr/src/app

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./

# создание сборки для продакшн
#RUN npm ci --only=production

# копируем исходный код
COPY . .
# Устанавливаем зависимости, собираем проект и удаляем зависимости
RUN npm install --production && npm run build:production && rm -rf node_module

# Проброс порта 3000
EXPOSE 3000

# Запуск по умолчанию 
CMD ["serve", "-s", "build"]
