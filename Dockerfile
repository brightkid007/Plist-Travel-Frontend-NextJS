FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ARG MOBISCROLL_TOKEN
RUN echo "@mobiscroll:registry=https://npm.mobiscroll.com" >> ~/.npmrc \
    && echo "//npm.mobiscroll.com/:_authToken=${MOBISCROLL_TOKEN}" >> ~/.npmrc \
    && echo "legacy-peer-deps=true" >> ~/.npmrc

# Fix Mobiscroll checksum issues (npm 10+ compatible)
RUN rm -f package-lock.json \
    && npm config set strict-ssl false

# Install dependencies
RUN npm install --legacy-peer-deps --force

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
