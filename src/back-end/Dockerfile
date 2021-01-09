FROM node:14-alpine As development

WORKDIR /usr/src/app

ADD package.json ./
ADD yarn.lock ./
ADD tsconfig.build.json ./

RUN yarn install --frozen-lockfile --prod=false

COPY . .

RUN yarn build

FROM node:14-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --prod=true

COPY . . 

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 8080

CMD ["yarn", "start:backend:prod"]