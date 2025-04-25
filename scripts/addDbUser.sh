#!/bin/bash
set -e

#create user for database
mongosh --file ./scripts/files/addDbUser.js