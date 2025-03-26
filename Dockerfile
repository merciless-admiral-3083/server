# Use a Node.js base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files for npm install
COPY ./SERVER/package*.json ./SERVER/

# Install dependencies
RUN npm install --prefix ./SERVER

# Copy the entire server code (including node_modules, auth.ts, etc.) to the container
COPY ./SERVER /app/SERVER

# Expose the backend port (change it to your actual backend port if needed)
EXPOSE 5000

# Run the backend server
CMD ["node", "SERVER/index.ts"]
