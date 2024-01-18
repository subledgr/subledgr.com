#!/bin/sh
# Replace the template file with the actual file
envsubst '${API_HOST},${API_PORT},${SERVER_NAME}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
# Start Nginx
exec nginx -g 'daemon off;'
