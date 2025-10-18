#!/bin/bash
docker run -it -e PGPASSWORD=password --rm --network test-network postgres psql -h test-db -U postgres