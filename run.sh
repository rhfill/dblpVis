#!/bin/bash

set -e

cd server
yarn

cd ..
yarn

(cd server && yarn dev) & (yarn dev) & wait