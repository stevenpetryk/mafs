#!/usr/bin/env bash
set -eu

COPIED_PACKAGE_JSON_STRUCTURE=$(
  tr -d '\012' <<-BOOP
    {
      name: .name,
      version: .version,
      main: "index.js",
      types: "mafs.d.ts",
      dependencies: .dependencies,
      peerDependencies: .peerDependencies,
    }
BOOP
)

echo "Creating custom package.json for this version"
cat package.json | jq "$COPIED_PACKAGE_JSON_STRUCTURE" > build/package.json

cp README.md build/README.md
