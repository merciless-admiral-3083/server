# Use a Node.js base image
FROM node:16-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files from the SERVER folder
COPY ./SERVER/package*.json ./SERVER/

# Install the dependencies inside the container (specific to the SERVER folder)
RUN npm install --prefix /app/SERVER

# Copy the rest of the server code (excluding node_modules) to the container
COPY ./SERVER /app/SERVER

RUN ls /app/SERVER/dist

# Expose the backend port (use the correct port for your application, default here is 5000)
EXPOSE 5000

# Run the backend server using the compiled index.js file
CMD ["node", "/app/SERVER/dist/index.js"]