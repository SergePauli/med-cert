FROM node:12

# Добавляем сертификат прокси в доверенные
# только в случае использования прокси-сервера
ADD squid.crt /usr/local/share/ca-certificates
RUN update-ca-certificates

# создание директории приложения и прав доступа
WORKDIR /usr/src/app
COPY --chown=node:node . .

# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
#COPY package*.json ./

# создание сборки для продакшн
#RUN npm ci --only=production

# копируем исходный код
COPY . .
# Устанавливаем зависимости, собираем проект и удаляем зависимости
RUN npm set strict-ssl false && npm install -g express-generator@4 && npm install express
# RUN npm set strict-ssl false  && npm install  && rm -rf node_module

# Проброс порта 3000
EXPOSE 3000

# пользователь для запуска
USER node

# Запуск по умолчанию 
CMD ["node", "node_run.js"]

