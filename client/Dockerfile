# Use the official Node.js image as the base image
FROM node:22.14.0

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY package.json .

# Install all the dependencies
RUN npm install

# Copy the content of the client folder to the working directory
COPY . .

# Expose the port the app runs in
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Command to run the server in development mode
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "--port", "3000"]

# Command to run the server in production mode
# CMD ["npm", "run", "start", "--", "-H", "0.0.0.0", "--port", "3000"]
