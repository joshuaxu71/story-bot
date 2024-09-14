# Use official Node.js 22.7.0 runtime as a parent image
FROM node:22.7.0

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (this must match the app's listening port)
EXPOSE 3000

# Command to start the Node.js app
CMD ["node", "index.js"]