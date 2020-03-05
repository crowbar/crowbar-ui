FROM google/nodejs
MAINTAINER Maximilian Meister <mmeister@suse.de>

ENV NODE_ENV=development
ENV PORT=3000

WORKDIR /crowbar-ui

RUN apt-get update && \
    apt-get --no-install-recommends install -y libfontconfig1 libfontconfig1-dev supervisor
RUN npm install --global gulp bower nodemon
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

ADD . .

RUN npm install && \
    bower --allow-root install && \
    npm build

EXPOSE 3000

ENTRYPOINT ["/usr/bin/supervisord"]
