FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ARG MOBISCROLL_TOKEN
RUN echo "@mobiscroll:registry=https://npm.mobiscroll.com" >> ~/.npmrc \
    && echo "//npm.mobiscroll.com/:_authToken=${MOBISCROLL_TOKEN}" >> ~/.npmrc \
    && echo "legacy-peer-deps=true" >> ~/.npmrc

# Fix Mobiscroll EINTEGRITY issues
RUN rm -f package-lock.json \
    && npm config set strict-ssl false \
    && npm config set legacy-peer-deps true \
    && npm config set prefer-offline false \
    && npm config set fetch-retries 3 \
    && npm config set cache-min 0

# Install dependencies
RUN npm install --legacy-peer-deps --force

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
