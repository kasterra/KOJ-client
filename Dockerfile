FROM node:18
WORKDIR /dockerApp

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]