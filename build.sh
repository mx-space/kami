#!/bin/sh
set -e
git pull
yarn --ignore-engines
rm -r .next
yarn build
cd .next
git init
mkdir _next
cp -r static _next
git add _next
git commit -m "update: $(date)"
git remote add origin git@github.com:Innei/web-cdn.git
git push -u origin master -f
yarn prod:stop
yarn prod:pm2