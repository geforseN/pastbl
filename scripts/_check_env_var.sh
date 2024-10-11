#!/usr/bin/env bash

check_host_var() {
  local var_name=$1
  local var_value=$2
  local valid_values=$3

  if [ -z "$var_value" ]; then
    echo "Error: $var_name environment variable is not set."
    exit 1
  fi

  if [[ ! $valid_values =~ $var_value ]]; then
    echo "Error: Invalid $var_name value. Allowed values: $valid_values."
    exit 1
  fi
}

check_port_var() {
  local var_name=$1
  local var_value=$2
  local min_value=$3
  local max_value=$4

  if [ -z "$var_value" ]; then
    echo "Error: $var_name environment variable is not set."
    exit 1
  fi

  if ! [[ "$var_value" =~ ^[0-9]+$ ]] || [ "$var_value" -lt "$min_value" ] || [ "$var_value" -gt "$max_value" ]; then
    echo "Error: Invalid $var_name value. Allowed values: $min_value-$max_value."
    exit 1
  fi
}
