#!/usr/bin/env bash
set -euo pipefail

releaseTar=$(pwd)/binary-releases/vulnmap.tgz

echo 'Creating temp directory for sandbox validation...'
pushd $(mktemp -d)

echo 'Running "npm install binary-releases/vulnmap.tgz"...'
npm install $releaseTar

echo 'Validating "vulnmap" command succeeds...'
./node_modules/vulnmap/bin/vulnmap -d

popd