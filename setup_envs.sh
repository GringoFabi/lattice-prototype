#!/usr/bin/env bash

touch .env.test

set -o noclobber

envType="$1"
logToConsole="$2"
persistLogs="$3"
localStorageLogs="$4"
localStorageLimit="$5"

echo "VITE_LOG_TO_CONSOLE=$logToConsole
VITE_PERSIST_LOGS=$persistLogs
VITE_LOCAL_STORAGE_LOGS=$localStorageLogs
VITE_LOCAL_STORAGE_LIMIT=$localStorageLimit" >| .env."$envType"
