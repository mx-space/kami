###
# @Author: Innei
# @Date: 2020-05-10 10:35:55
# @LastEditTime: 2020-09-13 18:02:39
# @LastEditors: Innei
# @FilePath: /mx-web/build.sh
# @Copyright
###
#!/bin/sh
set -e
export NODE_OPTIONS="--max_old_space_size=512"
git pull
yarn
rm -r .next
set -e
yarn build
cd .next
git init
mkdir _next
cp -r static _next
git add _next
git commit -m "update: $(date)"
git remote add origin git@github.com:Innei/web-cdn.git
git push -u origin master -f
yarn prod:reload
