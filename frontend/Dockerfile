FROM registry.gitlab.robotbull.com/robotbull/teamio/base/frontend:latest as build
COPY . .
RUN yarn build
CMD ["yarn", "run", "next", "start"]