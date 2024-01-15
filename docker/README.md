

builing the docker images

## Configure docker (desktop)

Settings > Docker Engine : Add insecure registries:
```json
{
  "insecure-registries": ["192.168.1.2:5002"]
}
```

## Build & deploy process

Process:
- build the docker images, push to registry
- re-build the stack in portainer
- or, re-create the individual services in portainer (pull image, re-create container)


```bash
# docker login -u docker -p d0ck3r localhost:5050
REGISTRY=docker.metaspan.io
docker login -u docker -p d0ck3r ${REGISTRY}

VERSION="0.2.1-beta" # "latest" !REQUIRED

# these can't be run together
# --load: load the image locally, this should make subsequent builds faster
# --push: push the image to the registry

# TODO: how to tag the image with a version number?

docker buildx build --platform linux/amd64 -t ${REGISTRY}/subledgr/subledgr-api:${VERSION} -f Dockerfile.api --push ../.
# docker build --platform linux/amd64 -t ${REGISTRY}/subledgr/subledgr-api:latest -f Dockerfile.api --push ../.
# docker tag subledgr/subledgr-api ${REGISTRY}/subledgr/subledgr-api
# docker push ${REGISTRY}/subledgr/subledgr-api

docker buildx build --platform linux/amd64 -t ${REGISTRY}/subledgr/subledgr-fe:${VERSION} -f Dockerfile.frontend --push ../.
# docker build --platform linux/amd64 -t ${REGISTRY}/subledgr/subledgr-fe:latest -f Dockerfile.frontend --push ../.
# docker tag subledgr/subledgr-fe ${REGISTRY}/subledgr/subledgr-fe
# docker push ${REGISTRY}/subledgr/subledgr-fe

# docker build --platform linux/amd64 -t subledgr/subledgr-datastore -f Dockerfile.postgres ../.
# docker tag subledgr/subledgr-datastore ${REGISTRY}/subledgr/subledgr-datastore
# docker push ${REGISTRY}/subledgr/subledgr-datastore

# proxy on 8081 for / and /grapghql
docker buildx build --platform linux/amd64 -t ${REGISTRY}/subledgr/nginx:${VERSION} -f Dockerfile.nginx --push ../.

docker buildx build --platform linux/amd64 -t ${REGISTRY}/subledgr/subledgr-workers:${VERSION} -f Dockerfile.workers --push ../.

# Updates in portainer
# for each service (in the stack), open the service and 
# > Click Update the service
# > Select Re-pull image
# > Click Update
# Double-check the environment & secrets are still in place

```

## GraphQL Express
```bash
docker build -t subledgr-api -f Dockerfile.graphql-express ../
```

## Setup the local registry

https://www.blackvoid.club/private-docker-registry-with-portainer/

