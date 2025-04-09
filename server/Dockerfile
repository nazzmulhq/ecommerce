# Use the official Node.js image as the base image
FROM node:22.14.0

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY package.json .

# Install all the dependencies
RUN npm install

# Copy the content of the server folder to the working directory
COPY . .

# Expose the port the app runs in
EXPOSE 3010

# Command to run the server in development mode
CMD ["npm", "run", "start:dev", "--", "-H", "localhost", "--port", "3010"]

# Command to run the server in production mode
# CMD ["npm", "run", "start:prod", "--", "-H", "localhost", "--port", "3010"]

