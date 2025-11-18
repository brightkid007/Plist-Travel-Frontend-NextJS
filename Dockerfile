FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

ARG MOBISCROLL_TOKEN
RUN echo "@mobiscroll:registry=https://npm.mobiscroll.com" >> ~/.npmrc \
    && echo "//npm.mobiscroll.com/:_authToken=${MOBISCROLL_TOKEN}" >> ~/.npmrc \
    && echo "legacy-peer-deps=true" >> ~/.npmrc

# Important Mobiscroll fixes
RUN rm -f package-lock.json
RUN npm config set verify-store-integrity false

# Install dependencies
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
