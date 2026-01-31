#!/bin/bash
# Extract all tags from .mdx files in src/content/blog/
# Handles formats like:
# tags: ['tag1', 'tag2']
# tags: ["tag1", "tag2"]
# tags: [tag1, tag2]

find src/content/blog -name "*.mdx" -exec grep -h "tags:" {} + | \
  sed "s/tags: //g" | \
  tr -d '[]"'\'' ' | \
  tr ',' '\n' | \
  sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
  grep -v '^$' | \
  grep -v '^tags:$' | \
  sort | uniq
