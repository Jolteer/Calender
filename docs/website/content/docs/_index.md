---
title: "📚 Documentation"
date: 2025-12-01
draft: false
description: "Complete documentation for the Calendar Application"
---

Welcome to the Calendar Application documentation. Here you'll find everything you need to understand, use, and extend the application.

## Documentation Sections

### 📖 [User Manual](/docs/user-manual/)
Complete guide for using the Calendar Application, including all features, tips, and troubleshooting.

### 🏗️ [Architecture](/docs/architecture/)
Technical documentation covering system design, code structure, design patterns, and API specifications.

### 🔌 [API Reference](/docs/api/)
Detailed REST API documentation with endpoints, request/response formats, and examples.

---

## Quick Links

| Topic | Description |
|-------|-------------|
| [Getting Started](/getting-started/) | Set up the application |
| [Features](/features/) | Explore all features |
| [Demo](/demo/) | Try the live demo |

---

## Technology Overview

The Calendar Application uses a modern tech stack:

```
┌─────────────────────────────────────────┐
│           FRONTEND                       │
│  HTML5 + CSS3 + JavaScript + Bootstrap  │
└─────────────────┬───────────────────────┘
                  │ REST API
┌─────────────────▼───────────────────────┐
│           BACKEND                        │
│     Python FastAPI + Pydantic           │
└─────────────────┬───────────────────────┘
                  │ Motor (Async Driver)
┌─────────────────▼───────────────────────┐
│           DATABASE                       │
│        MongoDB Atlas (Cloud)            │
└─────────────────────────────────────────┘
```

