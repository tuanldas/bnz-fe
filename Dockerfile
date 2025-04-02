FROM node:20 AS base

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV ZSH_VERSION=v1.2.1

COPY package*.json ./

RUN npm install

# --------- Development Stage ---------
FROM base AS dev

COPY . .

RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/$ZSH_VERSION/zsh-in-docker.sh)" -- \
    -t frisk

CMD ["npm", "run", "dev"]

# --------- Build Stage for Production ---------
FROM base AS build-product

COPY . .

RUN npm run build

FROM nginx:1.16.0-alpine AS production

COPY vhost.conf /etc/nginx/conf.d/default.conf

COPY --from=build-product /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
