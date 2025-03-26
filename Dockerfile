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

# Expose the backend port (use the correct port for your application, default here is 5000)
EXPOSE 5000

# Run the backend server using the compiled index.js file
CMD ["node", "/SERVER/index.ts"]

# Build step to transpile typescript.
# This makes the docker file multi-stage.
# This makes the docker image smaller, as dev dependencies are not included in the final image.
# You need to run tsc to produce index.js.
# add the following to package.json scripts: "build": "tsc"

# If you want to build typescript inside the dockerfile, you can use the following.
# But it will make the image bigger.
# FROM node:16-alpine as builder
# WORKDIR /app
# COPY ./SERVER/package*.json ./SERVER/
# RUN npm install --prefix /app/SERVER
# COPY ./SERVER /app/SERVER
# RUN npm run --prefix /app/SERVER build

# FROM node:16-alpine
# WORKDIR /app
# COPY --from=builder /app/SERVER/package*.json ./SERVER/
# COPY --from=builder /app/SERVER/node_modules ./SERVER/node_modules
# COPY --from=builder /app/SERVER/index.js ./SERVER/index.js
# COPY --from=builder /app/SERVER/shared ./SERVER/shared
# COPY --from=builder /app/SERVER/auth.js ./SERVER/auth.js
# COPY --from=builder /app/SERVER/openai.js ./SERVER/openai.js
# COPY --from=builder /app/SERVER/routes.js ./SERVER/routes.js
# COPY --from=builder /app/SERVER/schema.js ./SERVER/schema.js
# COPY --from=builder /app/SERVER/storage.js ./SERVER/storage.js

# EXPOSE 5000
# CMD ["node", "/app/SERVER/index.js"]