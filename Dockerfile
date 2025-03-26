# Use a lightweight Node.js image
FROM node:18-alpine

# Install necessary build dependencies
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files, including `server/index.ts`
COPY . .

# Verify files exist inside the container
RUN ls -l /app/server/

# Build the backend
RUN npm run build

# Expose the backend port
EXPOSE 3000

# Start the backend
CMD ["node", "dist/index.js"]
