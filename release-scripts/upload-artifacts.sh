#!/usr/bin/env bash
set -euo pipefail

PROTOCOL_VERSION_FILE=$(basename "$(/bin/ls binary-releases/ls-protocol-version*)")

declare -a StaticFiles=(
  "binary-releases/$PROTOCOL_VERSION_FILE"
  "binary-releases/vulnmap-alpine"
  "binary-releases/vulnmap-linux"
  "binary-releases/vulnmap-linux-arm64"
  "binary-releases/vulnmap-macos"
  "binary-releases/vulnmap-macos-arm64"
  "binary-releases/vulnmap-win.exe"
  "binary-releases/vulnmap-alpine.sha256"
  "binary-releases/vulnmap-linux.sha256"
  "binary-releases/vulnmap-linux-arm64.sha256"
  "binary-releases/vulnmap-macos.sha256"
  "binary-releases/vulnmap-macos-arm64.sha256"
  "binary-releases/vulnmap-win.exe.sha256"
  "binary-releases/sha256sums.txt.asc"
)

declare -a StaticFilesFIPS=(
  "binary-releases/fips/$PROTOCOL_VERSION_FILE"
  "binary-releases/fips/vulnmap-linux"
  "binary-releases/fips/vulnmap-linux-arm64"
  "binary-releases/fips/vulnmap-win.exe"
  "binary-releases/fips/vulnmap-linux.sha256"
  "binary-releases/fips/vulnmap-linux-arm64.sha256"
  "binary-releases/fips/vulnmap-win.exe.sha256"
  "binary-releases/fips/sha256sums.txt.asc"
)

VERSION_TAG="v$(cat binary-releases/version)"
DRY_RUN=false

if [ ${#} == 0 ]; then
  echo "No upload target defined!"
  exit 1
fi

show_help() {
  echo "Usage: upload-artifacts.sh [options] [arguments]"
  echo "Upload artifacts to GitHub, npm, or S3"
  echo ""
  echo "Options:"
  echo "  -h --help: show this help message and exit"
  echo "  --dry-run: perform a dry run of the upload"
  echo ""
  echo "Arguments:"
  echo "  version       version tag to upload artifacts to"
  echo "  github        upload artifacts to GitHub"
  echo "  npm           upload artifacts to npm"
  echo "  s3            upload artifacts to S3"
  echo ""
  echo "Example:"
  echo "  upload-artifacts.sh v1.0.0 github npm s3"
  echo ""
  echo "  This will upload artifacts to GitHub, npm, and S3 for version v1.0.0"
  echo ""
  echo "  upload-artifacts.sh --dry-run v1.0.0 github npm s3"
  echo ""
  echo "  This will perform a dry run of uploading artifacts to GitHub, npm, and S3 for version v1.0.0"
  echo ""
  echo -e "\033[1;33mTrigger Build and Publish Vulnmap Images:\033[0m"  # Set color to yellow
  echo ""
  echo "  upload-artifacts.sh trigger-vulnmap-images"
  echo ""
  echo "  This will trigger the build-and-publish workflow in the vulnmap-images repository."
  echo ""
}

upload_github() {
  if [ "${DRY_RUN}" == true ]; then
    echo "DRY RUN: uploading draft to GitHub..."
    gh release create "${VERSION_TAG}" "${StaticFiles[@]}" \
      --draft \
      --target "${CIRCLE_SHA1}" \
      --title "${VERSION_TAG}" \
      --notes-file binary-releases/RELEASE_NOTES.md

    echo "DRY RUN: deleting draft from GitHub..."
    gh release delete "${VERSION_TAG}" \
      --yes
  else
    echo "Uploading to GitHub..."
    gh release create "${VERSION_TAG}" "${StaticFiles[@]}" \
      --target "${CIRCLE_SHA1}" \
      --title "${VERSION_TAG}" \
      --notes-file binary-releases/RELEASE_NOTES.md
  fi
}

upload_npm() {
  if [ "${DRY_RUN}" == true ]; then
    echo "DRY RUN: uploading to npm..."
    npm config set '//registry.npmjs.org/:_authToken' "${HAMMERHEAD_NPM_TOKEN}"
    npm publish --dry-run ./binary-releases/vulnmap-fix.tgz
    npm publish --dry-run ./binary-releases/vulnmap-protect.tgz
    npm publish --dry-run ./binary-releases/vulnmap.tgz
  else
    echo "Uploading to npm..."
    npm config set '//registry.npmjs.org/:_authToken' "${HAMMERHEAD_NPM_TOKEN}"
    npm publish ./binary-releases/vulnmap-fix.tgz
    npm publish ./binary-releases/vulnmap-protect.tgz
    npm publish ./binary-releases/vulnmap.tgz
  fi
}

trigger_build_vulnmap_images() {
  echo "Triggering build-and-publish workflow at vulnmap-images..."
  RESPONSE=$(curl -L \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $HAMMERHEAD_GITHUB_PAT" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/repos/khulnasoft-lab/vulnmap-images/dispatches \
    -d "{\"event_type\":\"build_and_push_images\", \"client_payload\": {\"version\": \"$VERSION_TAG\"}}" \
    -w "%{http_code}" \
    -o /dev/null)
  if [ "$RESPONSE" -eq 204 ]; then
    echo "Successfully triggered build-and-publish workflow at vulnmap-images."
  else
    echo "Failed to trigger build-and-publish workflow at vulnmap-images. HTTP response code: $RESPONSE."
    exit 1
  fi
}

upload_s3() {
  version_target=$1
  if [ "${DRY_RUN}" == true ]; then
    echo "DRY RUN: uploading to S3..."
    for filename in "${StaticFiles[@]}"; do
      aws s3 cp "${filename}" s3://"${PUBLIC_S3_BUCKET}"/cli/"${version_target}"/ --dryrun
    done
    aws s3 cp "binary-releases/release.json" s3://"${PUBLIC_S3_BUCKET}"/cli/"${version_target}"/ --dryrun
    aws s3 cp "binary-releases/version" s3://"${PUBLIC_S3_BUCKET}"/cli/"${version_target}"/ --dryrun

    for filename in "${StaticFilesFIPS[@]}"; do
      aws s3 cp "${filename}" s3://"${PUBLIC_S3_BUCKET}"/fips/cli/"${version_target}"/ --dryrun
    done
    aws s3 cp "binary-releases/fips/release.json" s3://"${PUBLIC_S3_BUCKET}"/fips/cli/"${version_target}"/ --dryrun
    aws s3 cp "binary-releases/fips/version" s3://"${PUBLIC_S3_BUCKET}"/fips/cli/"${version_target}"/ --dryrun
  else
    echo "Uploading to S3..."
    for filename in "${StaticFiles[@]}"; do
      aws s3 cp "${filename}" s3://"${PUBLIC_S3_BUCKET}"/cli/"${version_target}"/
    done
    aws s3 cp "binary-releases/release.json" s3://"${PUBLIC_S3_BUCKET}"/cli/"${version_target}"/
    aws s3 cp "binary-releases/version" s3://"${PUBLIC_S3_BUCKET}"/cli/"${version_target}"/

    for filename in "${StaticFilesFIPS[@]}"; do
      aws s3 cp "${filename}" s3://"${PUBLIC_S3_BUCKET}"/fips/cli/"${version_target}"/
    done
    aws s3 cp "binary-releases/fips/release.json" s3://"${PUBLIC_S3_BUCKET}"/fips/cli/"${version_target}"/
    aws s3 cp "binary-releases/fips/version" s3://"${PUBLIC_S3_BUCKET}"/fips/cli/"${version_target}"/
  fi
}

# Capture valid flags
while getopts ":h:-:" opt; do
  case ${opt} in
    h)
      show_help
      exit 0
      ;;
    -)
      case "${OPTARG}" in
        help)
          show_help
          exit 0
          ;;
        dry-run)
          DRY_RUN=true
          ;;
        *)
          echo "Invalid option: --${OPTARG}" >&2
          exit 1
          ;;
      esac
      ;;
    \?)
      echo "Invalid option: ${OPTARG}" >&2
      exit 1
      ;;
  esac
done

# Remove flags from arguments
shift $((OPTIND-1))

# Interpret arguments
for arg in "${@}"; do
   target="${arg}"
    if [ "${arg}" == "version" ]; then
      target="${VERSION_TAG}"
    fi

  # Upload files to the GitHub release
  if [ "${arg}" == "github" ]; then
    upload_github

  # Upload files to npm
  elif [ "${arg}" == "npm" ]; then
    upload_npm

  # Trigger building Vulnmap images in vulnmap-images repository
  elif [ "${arg}" == "trigger-vulnmap-images" ]; then
    trigger_build_vulnmap_images

  # Upload files to S3 bucket
  else
    upload_s3 "${target}"
  fi
done