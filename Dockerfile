FROM node:latest

WORKDIR /src/
RUN git clone https://github.com/0xknstntn/price-feeder.git
WORKDIR /src/price-feeder
COPY .env .env
RUN npm install
RUN npm install tsc -g
RUN npm run build
CMD ["node", "index.js"]