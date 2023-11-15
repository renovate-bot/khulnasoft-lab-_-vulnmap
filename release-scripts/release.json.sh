#!/usr/bin/env bash
set -euo pipefail

INPUT_FILE="./release-scripts/release.json"
OUTPUT_FILE="binary-releases/release.json"
cp "${INPUT_FILE}" "${OUTPUT_FILE}"

if [[ $(uname -s) == "Darwin" ]];then
    echo "this is Mac"
    sed -i "" "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-alpine-sha256|$(cat binary-releases/vulnmap-alpine.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-linux-sha256|$(cat binary-releases/vulnmap-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-linux-arm64-sha256|$(cat binary-releases/vulnmap-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-macos-sha256|$(cat binary-releases/vulnmap-macos.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-macos-arm64-sha256|$(cat binary-releases/vulnmap-macos-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-win.exe-sha256|$(cat binary-releases/vulnmap-win.exe.sha256)|" "${OUTPUT_FILE}"
else
    echo "this is Linux"
    sed -i "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-alpine-sha256|$(cat binary-releases/vulnmap-alpine.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-linux-sha256|$(cat binary-releases/vulnmap-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-linux-arm64-sha256|$(cat binary-releases/vulnmap-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-macos-sha256|$(cat binary-releases/vulnmap-macos.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-macos-arm64-sha256|$(cat binary-releases/vulnmap-macos-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-win.exe-sha256|$(cat binary-releases/vulnmap-win.exe.sha256)|" "${OUTPUT_FILE}"
fi

# sanity check if release.json is a valid JSON
jq '.' "${OUTPUT_FILE}"

# do the same for fips
INPUT_FILE="./release-scripts/release-fips.json"
OUTPUT_FILE="binary-releases/fips/release.json"
cp "${INPUT_FILE}" "${OUTPUT_FILE}"

if [[ $(uname -s) == "Darwin" ]];then
    echo "this is Mac"
    sed -i "" "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-linux-sha256|$(cat binary-releases/vulnmap-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-linux-arm64-sha256|$(cat binary-releases/vulnmap-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "" "s|vulnmap-win.exe-sha256|$(cat binary-releases/vulnmap-win.exe.sha256)|" "${OUTPUT_FILE}"
else
    echo "this is Linux"
    sed -i "s|1.0.0-monorepo|$(cat binary-releases/version)|g" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-linux-sha256|$(cat binary-releases/vulnmap-linux.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-linux-arm64-sha256|$(cat binary-releases/vulnmap-linux-arm64.sha256)|" "${OUTPUT_FILE}"
    sed -i "s|vulnmap-win.exe-sha256|$(cat binary-releases/vulnmap-win.exe.sha256)|" "${OUTPUT_FILE}"
fi

# sanity check if release.json is a valid JSON
jq '.' "${OUTPUT_FILE}"