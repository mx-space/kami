FROM node:16-buster-slim
WORKDIR /app
ARG BASE_URL
ENV BASE_URL=${BASE_URL}
ENV NEXT_PUBLIC_API_URL=${BASE_URL}/api/v2
ENV NEXT_PUBLIC_GATEWAY_URL=${BASE_URL}
RUN node -e "console.log(process.env)"
COPY . .
RUN npm i -g pnpm
RUN pnpm install
RUN pnpm run build
RUN rm -rf .next/cache
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
EXPOSE 2323
CMD echo "MixSpace Web [Kami] Image." && node server.js

