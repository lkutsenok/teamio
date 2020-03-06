FROM node:buster-slim
WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "run", "next", "start"]