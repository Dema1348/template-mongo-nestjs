# Building image
################
FROM node:12-alpine AS builder
WORKDIR /app

# Doppler installation
RUN (curl -Ls https://cli.doppler.com/install.sh || wget -qO- https://cli.doppler.com/install.sh) | sh

COPY ./package.json ./
RUN yarn 
COPY . .
RUN yarn build


# Running image
###############
FROM gcr.io/distroless/nodejs:14
# Using non root user
USER nobody:nobody

WORKDIR /app
COPY --from=builder /app ./

# Copying Doppler binaries
COPY --from=builder /usr/local/bin/doppler /usr/local/bin/doppler

CMD ["yarn",  "start:prod"]