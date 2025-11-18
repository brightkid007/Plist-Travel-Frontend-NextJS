# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Inject the Mobiscroll private token BEFORE install
ARG MOBISCROLL_TOKEN
RUN echo "@mobiscroll:registry=https://npm.mobiscroll.com" >> ~/.npmrc \
    && echo "//npm.mobiscroll.com/:_authToken=${MOBISCROLL_TOKEN}" >> ~/.npmrc \
    && echo "legacy-peer-deps=true" >> ~/.npmrc

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]