FROM node:22.14.0
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
RUN npm run build
EXPOSE 5000
CMD [ "npm", "run", "start" ]
