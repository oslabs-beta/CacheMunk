# Use the official Node.js slim image as the base
FROM node:slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm ci

# Copy the application code to the working directory
COPY . .

# Expose the port on which the application will run (replace 3000 with your app's port)
EXPOSE 3030

# Define the command to run the application
CMD ["npm", "start"]