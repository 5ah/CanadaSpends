# Department JSON Files - Content Editing Guide

This directory contains JSON files for all Ontario government departments/ministries. These files control both the spending data visualization and the text content that appears on each department's page on the CanadaSpends website.

## 📝 What You Can Edit

Each department JSON file contains **editable text fields** that control the content shown to website visitors. Look for these fields in each file:

### Editable Content Fields

- **`introText`** - Short introduction that appears at the top of the department page
- **`descriptionText`** - Detailed description including spending amounts and context
- **`roleText`** - Description of the department's role and importance to the province
- **`programsHeading`** - Heading for the programs and services section
- **`programsDescription`** - Description of what programs and services this department offers
- **`leadershipHeading`** - Heading for the leadership and oversight section
- **`leadershipDescription`** - Description of the department's leadership structure and oversight mechanisms
- **`prioritiesHeading`** - Local H2 heading for department-specific priorities section
- **`prioritiesDescription`** - Description of the department's key priorities and focus areas (supports bullet points with `•`)

## 🚫 What NOT to Edit

**Do not modify these fields** as they contain critical data used for visualizations:

- `name` - Official department name
- `totalSpendingFormatted` - Formatted spending amount
- `percentage` - Spending percentage
- `percentageFormatted` - Formatted percentage
- `categories` - Spending breakdown data
- `spending_data` - Hierarchical spending data for charts
- `generatedAt` - File generation timestamp

## 📋 How to Edit Content

### 1. Find Your Department

Open the appropriate `.json` file for the department you want to edit (e.g., `health.json`, `education.json`).

### 2. Locate the Editable Fields

Scroll to the bottom of the file to find the editable content fields:

```json
"introText": "Your intro text here...",
"descriptionText": "Your detailed description...",
"roleText": "Description of the department's role...",
"programsHeading": "Your programs section heading",
"programsDescription": "Description of programs and services...",
"leadershipHeading": "Your leadership section heading",
"leadershipDescription": "Description of leadership and oversight...",
"prioritiesHeading": "Your priorities section heading",
"prioritiesDescription": "Description of priorities with bullet points:\n\n• Priority 1 – Description here\n• Priority 2 – Description here"
```

### 3. Edit the Text

- Keep text **clear and informative**
- Use **proper grammar and spelling**
- Maintain a **professional tone**
- Keep **introText relatively short** (1-2 sentences)
- Make **descriptionText more detailed** but still concise

### 4. Use Template Variables (Optional)

You can use these placeholders in your text that will be automatically replaced:

- `{department.name}` - The department's official name
- `{jurisdiction.name}` - "Ontario"
- `{department.totalSpendingFormatted}` - e.g., "$82.9B"
- `{department.percentageFormatted}` - e.g., "40.1%"
- `{jurisdiction.totalProvincialSpendingFormatted}` - "$206.6B"
- `{jurisdiction.financialYear}` - "2023-24"

## 💡 Editing Tips & Best Practices

### Good Examples:

**Intro Text:**

```json
"introText": "The Ministry of Health is responsible for Ontario's healthcare system, ensuring accessible, high-quality medical care and public health services for all Ontarians across the province."
```

**Description Text:**

```json
"descriptionText": "The Ontario Ministry of Health spent $82.9B in fiscal year (FY) 2023-24, representing 40.1% of the $206.6B in total provincial spending. This substantial investment ensures Ontarians have access to hospitals, physicians, public health programs, and essential medical services."
```

### Avoid:

- ❌ Very long sentences or paragraphs
- ❌ Technical jargon that the public won't understand
- ❌ Political language or partisan statements
- ❌ Outdated information or specific years (use template variables instead)
- ❌ Modifying non-editable fields

### Using Bullet Points in Priorities

For the `prioritiesDescription` field, you can create bullet points using the following format:

```json
"prioritiesDescription": "Department focuses on these key areas:\n\n• Priority Name – Description of this priority\n• Another Priority – Description of this priority\n• Third Priority – Description of this priority"
```

**Important formatting notes:**

- Use `•` (bullet character) at the start of each bullet point
- Separate priority name and description with `–` (space, dash, space)
- Use `\n\n` for line breaks between sections
- The priority names will automatically appear in **bold** on the website

## 🔍 Comments Section

Each file includes a `_comments` section that provides guidance:

```json
"_comments": {
  "_editing_guide": "The fields below can be edited to customize the department page content. These texts will appear on the public website.",
  "_introText": "Short introduction that appears at the top of the department page",
  "_descriptionText": "Detailed description - you can use placeholder variables like {jurisdiction.name}, {department.name}, etc.",
  "_roleText": "Description of the department's role and importance to the province",
  "_programsHeading": "Heading for the programs and services section",
  "_programsDescription": "Description of what programs and services this department offers"
}
```

**Note:** The `_comments` section is for editor guidance only and is **not displayed** to website visitors.

## 🌐 How Changes Appear

When you edit these fields:

1. **Website pages automatically update** with your new content
2. **Content is displayed in both English and French** (through our translation system)
3. **Template variables get replaced** with actual values
4. **Comments remain hidden** from public visitors

## 📁 File List

This directory contains JSON files for these Ontario departments:

- `agriculture-food-and-rural-affairs.json`
- `attorney-general.json`
- `board-of-internal-economy.json`
- `children-community-and-social-services.json`
- `citizenship-and-multiculturalism.json`
- `colleges-and-universities.json`
- `economic-development-job-creation-and-trade.json`
- `education.json`
- `energy.json`
- `environment-conservation-and-parks.json`
- `executive-offices.json`
- `finance.json`
- `francophone-affairs-francophone-affairs.json`
- `health.json`
- `indigenous-affairs.json`
- `infrastructure.json`
- `labour-immigration-training-and-skills-development.json`
- `long-term-care.json`
- `mines.json`
- `municipal-affairs-and-housing.json`
- `natural-resources-and-forestry.json`
- `northern-development.json`
- `public-and-business-service-delivery.json`
- `seniors-and-accessibility.json`
- `solicitor-general.json`
- `tourism-culture-and-sport.json`
- `transportation.json`
- `treasury-board-secretariat.json`

## 🛠️ Technical Notes

- Files are in **JSON format** - be careful with syntax (quotes, commas, brackets)
- **Validate your JSON** after editing to ensure no syntax errors
- **Save the file** after making changes
- Changes will be reflected when the website is rebuilt/deployed

## ❓ Questions or Issues?

If you encounter any problems or have questions about editing these files, please reach out to the development team.
