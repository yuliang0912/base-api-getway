FROM daocloud.io/node:6.2.1

MAINTAINER yuliang <yuliang@ciwong.com>

RUN mkdir -p /opt/apt-getway

RUN npm install -g pm2

WORKDIR /opt/apt-getway

COPY ./package.json /opt/apt-getway/

RUN npm install
## RUN npm install && bower install --allow-root

COPY . /opt/apt-getway/

#ENV
#VOLUME ['/opt/logs','/opt/logs/db','/opt/logs/koa','/opt/logs/track']

ENV NODE_ENV development

EXPOSE 8000

ENTRYPOINT pm2 start pm2.json --no-daemon --env test
