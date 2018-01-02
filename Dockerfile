FROM daocloud.io/node:8.5

MAINTAINER yuliang <yu.liang@freelog.com>

RUN mkdir -p /data/apt-gateway

WORKDIR /data/apt-gateway

COPY . /data/apt-gateway/

RUN npm install

#ENV
VOLUME ['/opt/logs']

ENV NODE_ENV production
ENV PORT 8895

EXPOSE 8895

CMD [ "npm", "start" ]
