#!/bin/bash
export PGPASSWORD=password

psql -U postgres -h localhost -p 5435 -f ../queries/init.sql 
psql -U postgres -h localhost -p 5435 -f ../queries/insert-system-data.sql
psql -U postgres -h localhost -p 5435 -f ../queries/seed.sql