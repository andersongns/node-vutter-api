FROM node:14.x

COPY ./ /app

RUN cd /app \
	&& npm install

WORKDIR /app

CMD ["npm", "start"]
