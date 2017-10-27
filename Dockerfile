FROM daocloud.io/node:8.1.2

MAINTAINER yuliang <yuliang@ciwong.com>

RUN mkdir -p /data/apt-gateway

WORKDIR /data/apt-gateway

COPY . /data/apt-gateway/

RUN npm install

#ENV
#VOLUME ['/opt/logs','/opt/logs/db','/opt/logs/koa','/opt/logs/track']

ENV NODE_ENV production
ENV PORT 8895

EXPOSE 8895

CMD [ "npm", "start" ]
