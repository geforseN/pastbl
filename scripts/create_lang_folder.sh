#!/bin/bash

# NOTE: execute firstly: chmod +x scripts/create_lang_folder.sh

create_lang_folder() {
  local path=$1
  local lang_folder="$path/lang"

  local content="{\n\t\n}"
  mkdir -p "$lang_folder"
  for lang in en ru; do
    echo -e "$content" > "$lang_folder/$lang.json"
  done
}

create_lang_folder "$1"
