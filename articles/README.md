# Canada Spends Articles CMS

This directory contains all articles for the Canada Spends website. Articles are written in MDX (Markdown + JSX), which allows rich formatting with the ability to embed React components.

## Table of Contents

- [Quick Start](#quick-start)
- [File Structure](#file-structure)
- [Adding a New Article](#adding-a-new-article)
- [Writing in MDX](#writing-in-mdx)
- [Managing Authors](#managing-authors)
- [Article Metadata](#article-metadata)
- [Images and Media](#images-and-media)
- [Available MDX Components](#available-mdx-components)
- [Bilingual Support](#bilingual-support)
- [Related Articles](#related-articles)

## Quick Start

To add a new article:

1. Create a folder structure: `articles/en/your-article-slug/`
2. Add `metadata.json` with article details
3. Write content in `index.mdx`
4. Add images to `images/` subfolder
5. Create French version in `articles/fr/your-article-slug/`
6. Restart the dev server

Your article will automatically appear on `/en/articles` and `/fr/articles`!

## File Structure

```
articles/
├── README.md                    # This file
├── authors.json                 # All author profiles
├── en/                         # English articles
│   └── article-slug/
│       ├── index.mdx           # Article content
│       ├── metadata.json       # Article metadata
│       └── images/             # Article images
│           └── thumbnail.jpg
└── fr/                         # French articles (same structure)
    └── article-slug/
        ├── index.mdx
        ├── metadata.json
        └── images/
            └── thumbnail.jpg
```

## Adding a New Article

### Step 1: Create the Directory Structure

For English:

```bash
mkdir -p articles/en/your-article-slug/images
```

For French:

```bash
mkdir -p articles/fr/your-article-slug/images
```

**Important:** Use the **same slug** for both English and French versions!

### Step 2: Create `metadata.json`

Create `articles/en/your-article-slug/metadata.json`:

```json
{
  "title": "Your Article Title",
  "subtitle": "A compelling subtitle that describes the article",
  "publishDate": "2025-10-18",
  "author": "author-id",
  "thumbnail": "./images/thumbnail.jpg",
  "tags": ["budget", "analysis", "federal"],
  "featured": false,
  "relatedArticles": ["other-article-slug", "another-article-slug"]
}
```

### Step 3: Write the Article Content

Create `articles/en/your-article-slug/index.mdx`:

```mdx
# Your Article Title

Your introduction paragraph goes here...

## Section Heading

Your content with **bold text**, _italic text_, and [links](https://example.com).

### Subsection

More content here.

<Callout type="info">
  Important information highlighted in a callout box.
</Callout>

## Conclusion

Wrap up your article here.
```

### Step 4: Add Images

Place your images in `articles/en/your-article-slug/images/`:

- `thumbnail.jpg` - Main article thumbnail (recommended: 1200x630px)
- Other images as needed

### Step 5: Create the French Version

Repeat steps 2-4 in `articles/fr/your-article-slug/` with French content.

## Writing in MDX

MDX allows you to write Markdown with embedded React components. Here's what you can use:

### Basic Markdown

```mdx
# Heading 1

## Heading 2

### Heading 3

**Bold text**
_Italic text_

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)

> Blockquote
```

### Tables

Use HTML tables in MDX (Markdown table syntax is not supported without additional plugins):

```mdx
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
      <td>Data 3</td>
    </tr>
    <tr>
      <td>Data 4</td>
      <td>Data 5</td>
      <td>Data 6</td>
    </tr>
  </tbody>
</table>
```

### Code Blocks

\`\`\`javascript
const example = "code block";
console.log(example);
\`\`\`

Inline code: \`const variable = "value"\`

### Images

```mdx
![Alt text](./images/my-image.jpg)
```

## Managing Authors

Authors are defined in `articles/authors.json`. To add a new author:

```json
{
  "author-id": {
    "id": "author-id",
    "name": "Author Name",
    "bio": "Short bio describing the author's expertise",
    "photo": "/about/author_photo.jpeg",
    "social": {
      "twitter": "username",
      "linkedin": "linkedin-username",
      "website": "https://example.com"
    }
  }
}
```

**Note:** The `photo` path should reference an existing image in the `public` directory or the `/about` page.

## Article Metadata

### Required Fields

- `title` (string) - Article title
- `subtitle` (string) - Brief description
- `publishDate` (string) - ISO format date (YYYY-MM-DD)
- `author` (string) - Author ID from `authors.json`

### Optional Fields

- `thumbnail` (string) - Path to thumbnail image (relative or absolute)
  - Relative: `"./images/thumbnail.jpg"` (recommended)
  - Absolute: `"/path/to/image.jpg"`
- `tags` (array) - List of tags for categorization
  - Examples: `["budget", "federal", "analysis", "2025"]`
- `featured` (boolean) - Show in featured section (default: `false`)
- `relatedArticles` (array) - Slugs of related articles
  - Example: `["article-1", "article-2"]`

## Images and Media

**IMPORTANT**: All article images must be stored in the `public` directory to be accessible via URLs.

### Thumbnail Images

- **Recommended size:** 1200x630px (open graph standard)
- **Format:** JPG or PNG
- **Location:** `public/articles/[lang]/[slug]/images/thumbnail.jpg`

### Article Images

Place images in `public/articles/[lang]/[slug]/images/`:

```mdx
![Canada Federal Budget Chart](./images/budget-chart.png)
```

The `./images/` relative path in your MDX will automatically resolve to `/articles/[lang]/[slug]/images/` in the rendered HTML.

### Using the Figure Component

For images with captions:

```mdx
<Figure
  src="./images/spending-breakdown.png"
  alt="Federal spending breakdown by department"
  caption="Figure 1: Federal spending distribution across major departments"
/>
```

## Available MDX Components

### Callout Boxes

Highlight important information:

```mdx
<Callout type="info">This is informational content.</Callout>

<Callout type="warning">This is a warning message.</Callout>

<Callout type="success">
  This indicates success or positive information.
</Callout>

<Callout type="error">This indicates an error or critical information.</Callout>
```

### Figure with Caption

```mdx
<Figure
  src="./images/chart.png"
  alt="Descriptive alt text"
  caption="Optional caption text"
/>
```

### Standard HTML/React Components

Since MDX supports JSX, you can also use standard HTML or import React components.

## Bilingual Support

All articles should have both English and French versions:

1. **Use the same slug** for both languages
2. **Translate all metadata** in `metadata.json`
3. **Translate the full article content** in `index.mdx`
4. **Use the same image files** (copy to both language directories)

The site automatically routes users to the correct language version based on their locale preference.

## Related Articles

### Automatic Related Articles

If you don't specify `relatedArticles` in metadata, the system automatically finds related articles by:

1. Matching tags (articles with overlapping tags)
2. Recent articles (if no tag matches)

### Manual Related Articles

For more control, specify related articles in `metadata.json`:

```json
{
  "relatedArticles": [
    "understanding-federal-budget-2025",
    "tax-policy-analysis"
  ]
}
```

**Note:** Use article slugs (folder names), not full paths.

## Reading Time

Reading time is calculated automatically based on word count (approximately 200 words per minute).

## Testing Your Article

1. Run the development server:

   ```bash
   pnpm dev
   ```

2. Navigate to:
   - English: `http://localhost:3000/en/articles/your-article-slug`
   - French: `http://localhost:3000/fr/articles/your-article-slug`

3. Check the article listing:
   - `http://localhost:3000/en/articles`
   - `http://localhost:3000/fr/articles`

## Build and Deploy

Articles are statically generated at build time:

```bash
pnpm build
```

All article pages are pre-rendered for optimal performance.

## Tips and Best Practices

1. **Keep URLs consistent:** Use lowercase, hyphen-separated slugs
2. **Write compelling subtitles:** They appear in article cards and meta descriptions
3. **Choose relevant tags:** Helps with article discovery and related articles
4. **Optimize images:** Compress images before adding them
5. **Preview before committing:** Always test your article locally
6. **Use featured sparingly:** Only mark truly exceptional articles as featured
7. **Link to related content:** Reference other Canada Spends pages where relevant
8. **Update related articles:** When publishing, consider updating older articles' `relatedArticles`

## Troubleshooting

### Article not showing up?

- Check that `index.mdx` and `metadata.json` exist
- Verify the JSON syntax in `metadata.json`
- Restart the dev server
- Check console for errors

### Images not loading?

- Verify image paths start with `./` for relative paths
- Check that images exist in the `images/` folder
- Ensure image filenames match exactly (case-sensitive)

### Build errors?

- Validate JSON syntax in `metadata.json`
- Check for unclosed MDX components
- Ensure all required metadata fields are present

## Need Help?

If you have questions about adding articles, reach out to the development team or consult the main project documentation.
