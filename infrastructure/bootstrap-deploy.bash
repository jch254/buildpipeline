#!/bin/bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/.." && pwd)

usage() {
  echo "Usage: $0 <test|prod|production|/path/to/buildspec.yml>" >&2
  exit 1
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1" >&2
    exit 1
  fi
}

resolve_buildspec() {
  case "${1:-}" in
    test)
      echo "${REPO_ROOT}/buildspec-test.yml"
      ;;
    prod|production)
      echo "${REPO_ROOT}/buildspec-prod.yml"
      ;;
    "")
      usage
      ;;
    *)
      if [[ -f "$1" ]]; then
        echo "$1"
      else
        usage
      fi
      ;;
  esac
}

export_buildspec_variables() {
  local buildspec_path="$1"

  while IFS=$'\t' read -r key value; do
    export "$key=$value"
    echo "Loaded buildspec variable: ${key}"
  done < <(
    ruby -r yaml -e '
      data = YAML.load_file(ARGV[0]) || {}
      variables = data.dig("env", "variables") || {}
      variables.each do |key, value|
        puts [key, value.to_s].join("\t")
      end
    ' "$buildspec_path"
  )
}

export_parameter_store_variables() {
  local buildspec_path="$1"

  while IFS=$'\t' read -r env_key parameter_name; do
    local parameter_value

    parameter_value=$(aws ssm get-parameter \
      --region "${TF_VAR_region:?}" \
      --name "$parameter_name" \
      --with-decryption \
      --query 'Parameter.Value' \
      --output text)

    export "$env_key=$parameter_value"
    echo "Loaded parameter-store variable: ${env_key}"
  done < <(
    ruby -r yaml -e '
      data = YAML.load_file(ARGV[0]) || {}
      parameters = data.dig("env", "parameter-store") || {}
      parameters.each do |key, value|
        puts [key, value.to_s].join("\t")
      end
    ' "$buildspec_path"
  )
}

main() {
  local buildspec_path

  require_command aws
  require_command ruby
  require_command terraform

  buildspec_path=$(resolve_buildspec "${1:-}")

  echo "Bootstrapping infrastructure using ${buildspec_path}..."

  export_buildspec_variables "$buildspec_path"
  export_parameter_store_variables "$buildspec_path"

  "${REPO_ROOT}/infrastructure/deploy-infrastructure.bash"

  echo "Bootstrap deploy complete. CodeBuild/CodePipeline can take over from here."
}

main "$@"