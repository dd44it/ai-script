# AI SEO Metadata Script

Node.js script for generating:

- TOP 20 relevant SEO tags
- SEO title
- content category

based on a user prompt and semantic keyword database.

The script uses:
- local keyword scoring
- Gemini API for semantic selection and generation
- SQLite for result storage
- JSON logs for success/error tracking

---

# Features

- Load keywords from `.ods`
- Filter blocked keywords
- Local keyword ranking
- AI semantic refinement
- SEO title generation
- Category classification
- Success/error logging
- SQLite storage

---

# Tech Stack

- Node.js
- Gemini API
- SQLite
- XLSX

---

# Installation

```bash
npm install
```
---

# Run Script

```bash
node index.js "cinematic anime girl walking in neon city"
```

---
# Output
- success logs
- error logs
- database records



