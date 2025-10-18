#!/bin/bash
if docker container ls|grep -q test-db;
then
    echo "db container exists"
else
    docker run -e POSTGRES_PASSWORD=password --name test-db --network test-network -p 5435:5432 -d postgres
fi
