#!/bin/bash
./create-network.sh
./create-test-db.sh
sleep 5
./init-test-db.sh