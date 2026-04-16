# Use the official Node.js runtime image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the server source code
COPY . .

# Expose port 8080 (as specified in the application code)
EXPOSE 8080

# Define the command to run the application
CMD ["node", "index.js"]
