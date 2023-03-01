FROM node:16
WORKDIR /WORK
COPY ./ ./
RUN yarn install
RUN yarn build
CMD yarn start:prod