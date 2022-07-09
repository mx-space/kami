#!env bash
CWD=$(pwd)
npm run build
cd .next
pwd
rm -rf cache
cp ../next.config.js ./standalone/next.config.js
cp -r ../public ./standalone/public

cd ./standalone
echo 'process.title = "Kami (NextJS)"' >>server.js
mv ../static/ ./.next/static

cp $CWD/ecosystem.standalone.config.js ./ecosystem.config.js

cd ..

zip --symlinks -r $CWD/release.zip ./*
