FROM alpine:3.8 AS base

WORKDIR /usr/src/app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh ca-certificates openssl

RUN apk add --no-cache nodejs nodejs-npm

COPY . .

ARG DEFAULT_DATA_STORAGE_DELIVERY_SERVICE_HOST=https://file.datagraviti.com/v1
ARG DEFAULT_CATEGORY_SERVICE_HOST=https://facade.datagraviti.com/api/v1
ARG DEFAULT_CATALOG_SERVICE_HOST=https://facade.datagraviti.com/api/v1
ARG DEFAULT_REVIEWS_SERVICE_HOST=https://facade.datagraviti.com/api/v1
ARG DEFAULT_TRADE_SERVICE_HOST=https://facade.datagraviti.com/api/v1
ARG DEFAULT_STREAM_SERVICE_HOST=https://stream.datagraviti.com/v1
ARG DEFAULT_STREAM_CONSUMPTION_SERVICE_HOST=https://kafka.datagraviti.com/consumers

ENV DATA_STORAGE_DELIVERY_SERVICE_HOST=$DEFAULT_DATA_STORAGE_DELIVERY_SERVICE_HOST
ENV CATEGORY_SERVICE_HOST=$DEFAULT_CATEGORY_SERVICE_HOST
ENV CATALOG_SERVICE_HOST=$DEFAULT_CATALOG_SERVICE_HOST
ENV REVIEWS_SERVICE_HOST=$DEFAULT_REVIEWS_SERVICE_HOST
ENV TRADE_SERVICE_HOST=$DEFAULT_TRADE_SERVICE_HOST
ENV STREAM_SERVICE_HOST=$DEFAULT_STREAM_SERVICE_HOST
ENV STREAM_CONSUMPTION_SERVICE_HOST=$DEFAULT_STREAM_CONSUMPTION_SERVICE_HOST

RUN npm install -g npm && npm i npm && \
    npm install -g bower && npm install bower && \
    npm install -g gulp && npm install gulp && \
    npm install && bower cache clean --allow-root && bower install --allow-root  && gulp build 

FROM base AS release

COPY --from=base /usr/src/app/dist ./dist
RUN npm install http-server -g
WORKDIR /usr/src/app/dist

CMD http-server


