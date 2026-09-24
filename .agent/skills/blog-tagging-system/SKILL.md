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
npm run list-tags
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

## Automated classification with Jev

`src/content/tag-taxonomy.json` is the controlled catalog of allowed tags and their definitions. Do not add tags merely because a classifier suggests a related concept.

Evaluate a new post without modifying it:
```bash
npm run tag-post -- src/content/blog/YYYY/MM/post.mdx
```

The command needs `TYPESAFE_API_KEY` in `.env`. It sends the post to Jev, evaluates only the existing taxonomy, and reports high-confidence tags, ambiguous tags, and whether the article needs a new-tag review. It writes tags only with `--write`, when it found 3–6 high-confidence tags, no ambiguous tags, and no new-tag review:
```bash
npm run tag-post -- src/content/blog/YYYY/MM/post.mdx --write
```

Existing tags are protected. Replacing them requires both `--write --replace`.

After changing a taxonomy definition or threshold, run the regression fixtures (also requires `TYPESAFE_API_KEY`). They evaluate posts in read-only mode and fail if `personal-software` stops matching its approved examples or starts matching its negative examples:
```bash
npm run test:tag-taxonomy
```

## Example
If an article is about AI's impact on developer productivity:
- Existing tags found: `ia`, `productividad`, `tendencias`, `carrera`.
- Applied: `tags: ['carrera', 'ia', 'productividad', 'tendencias']`
