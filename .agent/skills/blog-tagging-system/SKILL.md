---
name: Blog Tagging System
description: Standardizes the tagging process for blog posts by reusing existing tags and maintaining consistency.
---

# Blog Tagging System

This skill helps maintain a consistent taxonomy across the blog by providing a systematic way to analyze content and apply existing tags.

## Core Principles
1. **Reuse First**: Always attempt to use tags that already exist in the project before suggesting new ones.
2. **Consistency**: Use lowercase and slug-style formatting (e.g., `soft-skills` instead of `Soft Skills`).
3. **Relevance**: Select 3-6 tags that capture the core themes, technology, and intent of the article.
4. **Alphabetical Order**: Tags within the frontmatter should be sorted alphabetically for clean diffs.

## Workflow

### 1. Extract Existing Tags
Use the provided script to get the current "source of truth" for tags:
```bash
bash .agent/skills/blog-tagging-system/scripts/list-tags.sh
```

### 2. Content Analysis
Read the blog post and identify:
- **Primary Theme** (e.g., Leadership, Productivity, AI)
- **Secondary Themes** (e.g., Career, Soft Skills)
- **Technical Context** (e.g., React, PHP, Astro)
- **Target Audience/Intent** (e.g., Opinion, Tutorial, Insight)

### 3. Tag Selection
Map the identified themes to the list of existing tags. If a perfect match isn't found:
- Look for synonyms already in use.
- If a brand new tag is absolutely necessary, ensure it follows the project's naming conventions.

### 4. Application
Apply the tags to the MDX frontmatter in the standard format:
```yaml
tags: ['tag-a', 'tag-b', 'tag-c']
```

## Example
If an article is about AI's impact on developer productivity:
- Existing tags found: `ia`, `productividad`, `tendencias`, `carrera`.
- Applied: `tags: ['carrera', 'ia', 'productividad', 'tendencias']`
