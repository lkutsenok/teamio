FROM registry.gitlab.robotbull.com/robotbull/teamio/base/backend:latest as build
ARG ARG_JIRA_LOGIN
ARG ARG_JIRA_PASSWORD
ARG ARG_JIRA_URL
ARG ARG_MONGODB_URL
ARG ARG_MONTH_START_DAY
ARG ARG_SLACK_WEBHOOK_URL
ARG ARG_SENTRY_DSN
ENV NODE_ENV=${ARG_NODE_ENV}
ENV JIRA_LOGIN=${ARG_JIRA_LOGIN}
ENV JIRA_URL=${ARG_JIRA_URL}
ENV JIRA_PASSWORD=${ARG_JIRA_PASSWORD}
ENV MONGODB_URL=${ARG_MONGODB_URL}
ENV MONTH_START_DAY=${ARG_MONTH_START_DAY}
ENV SLACK_WEBHOOK_URL=${ARG_SLACK_WEBHOOK_URL}
ENV SENTRY_DSN=${ARG_SENTRY_DSN}
COPY . .
CMD ["yarn", "run", "serve"]
