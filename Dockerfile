FROM node:22.2.0-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma generate

RUN yarn build

# RUN yarn prisma migrate deploy

EXPOSE 3000

CMD ["yarn", "start:prod"]