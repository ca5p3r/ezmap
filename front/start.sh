#!/bin/sh
for file in $(find /usr/share/nginx/html -iname "*.css" -o -iname "*.html" -o -iname "*.js")
do
        /bin/sed -i "s|__REACT_APP_BACKEND_SERVICE__|${REACT_APP_BACKEND_SERVICE}|g"  $file
done
nginx -g 'daemon off;'
