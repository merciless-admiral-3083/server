# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy all files
COPY . .

# Build the backend
RUN npm run build

# Expose the backend port (change if needed)
EXPOSE 3000

# Start the backend
CMD ["node", "dist/index.js"]
