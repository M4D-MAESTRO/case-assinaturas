FROM node:14.18.0

WORKDIR /usr/app

COPY package.json ./

RUN npm install -g --unsafe-perm=true --allow-root && npm install -g typescript ts-node @nestjs/cli && npm install 

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]