FROM node:14.5.0

RUN git clone https://github.com/PoloLacoste/TikGetTok.git
WORKDIR TikGetTok
RUN touch .env

RUN npm install

EXPOSE 3000
CMD [ "node", "main.js" ]