# Use a Node.js base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files for npm install
COPY ./SERVER/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire server code to the container
COPY ./SERVER /app/

# Build the TypeScript files
RUN npx tsc

# Expose the backend port (use the correct port for your application)
EXPOSE 5000

# Run the backend server (now pointing to the compiled index.js)
CMD ["node", "./dist/index.js"]
