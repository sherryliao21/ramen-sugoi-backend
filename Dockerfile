# Base Image
FROM node:16-alpine

# update packages in distrubution and clear cache
RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

# Create app directory in container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

# Add wair-for-it
COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD [ "./wait-for-it.sh", "localhost:3000", "--strict", "node", "index.js" ]