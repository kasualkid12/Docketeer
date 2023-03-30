# Use an official Node.js runtime as a parent image
FROM node
# Set the working directory to /app
WORKDIR /app

COPY package*.json ./

# Run npm install to install app dependencies
RUN npm install

# Set the PATH env variable
# ENV PATH="/usr/local/bin:${PATH}"
# COPY /usr/local/bin/docker /usr/local/bin/docker
ENV DOCKERVERSION=19.03.12
RUN curl -fsSLO https://download.docker.com/linux/static/stable/x86_64/docker-${DOCKERVERSION}.tgz \
  && tar xzvf docker-${DOCKERVERSION}.tgz --strip 1 -C /usr/local/bin docker/docker \
  && rm docker-${DOCKERVERSION}.tgz

# Copy the current directory contents into the container at /app
COPY . .

# Make port 4000 available to the world outside this container
EXPOSE 4000
# EXPOSE 3000

# Start the app
CMD ["npm", "start"]



