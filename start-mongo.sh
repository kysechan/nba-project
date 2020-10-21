

docker run --name mongo -d \
    -e MONGO_INITDB_DATABASE=nba \
    -v $PWD/nba-mongo:/data/db \
    -p 27017:27017 \
    mongo:latest
