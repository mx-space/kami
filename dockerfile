FROM node:16-alpine
WORKDIR /app
ENV NETEASE_PHONE=
ENV NETEASE_PASSWORD=
ENV BASE_URL=
ENV NEXT_PUBLIC_APIURL=${BASE_URL}/api/v2
ENV NEXT_PUBLIC_GATEWAY_URL=${BASE_URL}
ENV NEXT_PUBLIC_TRACKING_ID=
COPY . .
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm run build
RUN rm -rf .next/cache
RUN touch .env
EXPOSE 2323
CMD echo "MixSpace Web [Kami] Image." && sh

