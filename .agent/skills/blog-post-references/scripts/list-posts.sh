#!/bin/bash
# List blog posts with metadata for cross-reference discovery.
#
# Usage:
#   list-posts.sh                    # all posts
#   list-posts.sh 2026               # filter by pubDate year
#   list-posts.sh --tags-from PATH   # posts sharing >=1 tag with PATH

set -euo pipefail

YEAR_FILTER=""
TAGS_FROM=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tags-from)
      TAGS_FROM="${2:?--tags-from requires a file path}"
      shift 2
      ;;
    *)
      YEAR_FILTER="$1"
      shift
      ;;
  esac
done

extract_field() {
  local file="$1"
  local field="$2"
  grep -m1 "^${field}:" "$file" 2>/dev/null | sed "s/^${field}: //" | tr -d '\r' || true
}

normalize_tags_line() {
  sed 's/tags: //g' | tr -d '[]"'\'' ' | tr ',' '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | grep -v '^$' || true
}

TARGET_TAGS=""
if [[ -n "$TAGS_FROM" ]]; then
  if [[ ! -f "$TAGS_FROM" ]]; then
    echo "File not found: $TAGS_FROM" >&2
    exit 1
  fi
  TARGET_TAGS=$(extract_field "$TAGS_FROM" tags | normalize_tags_line)
fi

shares_tag() {
  local file_tags="$1"
  local tag
  while IFS= read -r tag; do
    [[ -z "$tag" ]] && continue
    if echo "$file_tags" | grep -qx "$tag"; then
      return 0
    fi
  done <<< "$TARGET_TAGS"
  return 1
}

printf '%-4s | %-55s | %-8s | %s\n' "YEAR" "SLUG" "DRAFT" "TITLE"
printf '%s\n' "-----+---------------------------------------------------------+----------+------"

while IFS= read -r -d '' file; do
  slug=$(extract_field "$file" slug)
  [[ -z "$slug" ]] && continue

  title=$(extract_field "$file" title | sed 's/^"//;s/"$//')
  pub=$(extract_field "$file" pubDate | tr -d "'\"")
  year=$(echo "$pub" | cut -d- -f1)
  draft=$(extract_field "$file" draft)
  tags_line=$(extract_field "$file" tags)
  file_tags=$(echo "$tags_line" | normalize_tags_line)

  if [[ -n "$YEAR_FILTER" && "$year" != "$YEAR_FILTER" ]]; then
    continue
  fi

  if [[ -n "$TARGET_TAGS" ]] && ! shares_tag "$file_tags"; then
    continue
  fi

  printf '%-4s | %-55s | %-8s | %s\n' "$year" "$slug" "$draft" "$title"
done < <(find src/content/blog -name '*.mdx' -print0 | sort -z)
