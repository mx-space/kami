###
# @Author: Innei
# @Date: 2020-05-10 10:35:55
# @LastEditTime: 2020-05-26 19:48:35
# @LastEditors: Innei
# @FilePath: /mx-web/build.sh
# @Copyright
###
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
pm2 reload ecosystem.config.js
