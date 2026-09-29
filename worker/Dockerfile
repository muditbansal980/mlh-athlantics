FROM node:24

WORKDIR /app

COPY package.json .

RUN npm install

# FIX: Use apt-get for Debian-based images (not apk)
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["npm", "run", "dev"]