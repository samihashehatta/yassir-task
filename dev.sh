#!/bin/bash
# set -x
# set -e

function install_dependencies() {
    echo '============ installng install_dependencies ================='
    # install redis server
    sudo apt-get install redis-server
    
    # Hosts Manager Go Cli
    redis-server
    
}
function start() {
    echo '============ starting ================='
    npm i
    # Run migration
    npm run migration:dev
    
    # Start program
    npm run start:dev
    
}
if [ -z $@ ]; then
    echo "Please use on of these functions as parameter "
fi

$@