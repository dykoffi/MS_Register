FROM node:latest
ENV NODE_ENV=production
ADD build /App
WORKDIR /App
RUN npm i -g npm@8.3.0 && npm i && npm i -g pm2
CMD ["pm2-runtime","index.js","--name MS_Register"]