FROM node:lts-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src/shared ./src/shared
COPY tsconfig.json .
COPY db .
RUN npm run build:seed
CMD ["npm", "run", "seed"]

