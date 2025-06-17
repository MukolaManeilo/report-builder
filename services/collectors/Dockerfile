FROM node:22-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY ./src/prisma ./src/prisma
RUN yarn install --frozen-lockfile
RUN npx prisma generate
COPY . .
RUN yarn build
EXPOSE 3002
CMD ["node", "dist/main"]
