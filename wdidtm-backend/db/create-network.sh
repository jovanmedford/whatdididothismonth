#!/bin/bash
docker network ls|grep test-network -q || docker network create --driver bridge test-network