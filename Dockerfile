# Use a lightweight Node.js image
FROM node:18-alpine

# Install necessary Alpine dependencies for esbuild
RUN apk add --no-cache python3 make g++ 

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the backend
RUN npx esbuild --version # Debug: Check if esbuild is installed
RUN npm run build

# Expose the backend port (change if needed)
EXPOSE 3000

# Start the backend
CMD ["node", "dist/index.js"]
