#!/bin/bash

set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: $0 <image-ref> [required-architecture]" >&2
  exit 2
fi

image_ref="$1"
required_architecture="${2:-amd64}"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required to inspect image manifests" >&2
  exit 2
fi

inspect_output="$(docker manifest inspect --verbose "$image_ref" 2>/dev/null)"

if [[ -z "$inspect_output" ]]; then
  echo "Failed to inspect image manifest for $image_ref" >&2
  echo "If this is a private ECR image, run docker login against the registry first." >&2
  exit 1
fi

platforms="$(printf '%s\n' "$inspect_output" | awk '
  /"platform"[[:space:]]*:[[:space:]]*\{/ { in_platform=1; arch=""; os=""; next }
  in_platform && /"architecture"[[:space:]]*:/ {
    line=$0
    sub(/.*"architecture"[[:space:]]*:[[:space:]]*"/, "", line)
    sub(/".*/, "", line)
    arch=line
    next
  }
  in_platform && /"os"[[:space:]]*:/ {
    line=$0
    sub(/.*"os"[[:space:]]*:[[:space:]]*"/, "", line)
    sub(/".*/, "", line)
    os=line
    next
  }
  in_platform && /}/ {
    if (arch != "" && os != "") {
      print os "/" arch
    }
    in_platform=0
  }
' | sort -u)"

if [[ -z "$platforms" ]]; then
  echo "No platform metadata found for $image_ref" >&2
  exit 1
fi

printf 'Detected platforms for %s:\n' "$image_ref"
printf '  %s\n' $platforms

if printf '%s\n' "$platforms" | grep -qx "linux/$required_architecture"; then
  echo "Image is compatible with CodeBuild requirement linux/$required_architecture"
  exit 0
fi

echo "Image is missing required platform linux/$required_architecture" >&2
exit 1