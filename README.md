# The Tadabbur Journal

A personal Qur'an reflection (tadabbur) journal — built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion. MongoDB Atlas for content management with a private admin dashboard.

---

## ✨ What this is

This is **not** a tafsir website. It is a personal journal for recording reflections, lessons, and contemplations (*tadabbur*) inspired by reading the Qur'an alongside authentic tafsir. Every reflection page clearly labels itself **"Tadabbur · Personal Reflection"** and links to a disclaimer.

---

## 🚀 Quick start (local development)

```bash
npm install
npm run dev
```

**Without `MONGODB_URI`:** the site automatically falls back to the markdown files in `content/` — so you can work locally with zero database setup.

**With `MONGODB_URI`:** the site reads from MongoDB Atlas. Set your env vars in `.env.local` (see below).

---

## ⚙️ Environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ADMIN_USERNAME` | Username for admin login |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of your admin password |
| `JWT_SECRET` | 32+ char random secret for signing tokens |

### Generating a password hash

```bash
node scripts/hash-password.mjs your-password-here
```

Paste the output into `ADMIN_PASSWORD_HASH` in `.env.local`.

### Generating a JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🗄️ Migrating existing markdown content to MongoDB

If you have existing reflections in `content/` and want to seed MongoDB:

```bash
MONGODB_URI="mongodb+srv://..." node scripts/seed.mjs
```

This is safe to run multiple times — it skips any Surah:Ayah combination already in the database.

---

## 🔐 Admin dashboard

Visit `/admin/login` to sign in. The admin is completely hidden from:
- The public navbar
- The public footer
- All public pages

Admin features:
- **Create** new reflections with a full form
- **Edit** any reflection
- **Delete** reflections
- **Publish / unpublish** individual reflections (drafts are not visible to the public)

---

## ✍️ Content management

### Option A — Admin dashboard (recommended)

1. Go to `your-site.com/admin/login`
2. Sign in with your `ADMIN_USERNAME` and password
3. Click **New reflection** and fill in the form
4. Choose **Save as draft** or **Publish**

### Option B — Markdown files (local / fallback)

Create files under `content/<surah>/<ayah>.md` with this frontmatter:

```markdown
---
title: "Your Title"
surah: 49
surahName: "Al-Hujurat"
ayahStart: 11
ayahEnd: 11
arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا…"
translation: "O believers!…"
date: "2026-01-12"
tags: ["character", "dignity"]
---

Your reflection prose here.

~ Your Name
```

---

## 📱 Download as Post

On every reflection page, a **"Download as Post"** button generates a 1080×1080 PNG image suitable for Instagram, WhatsApp Status, and Telegram. The image uses the same design system: warm paper background, gold accents, emerald branding.

---

## 🎨 Rebranding

All site-wide copy lives in `src/lib/site-config.ts`. Edit that one file to rename the site, change the tagline, update the author name, or swap the closing dua.

---

## 🗂️ Project structure

```
content/                         ← Markdown fallback content
scripts/
  seed.mjs                       ← Seed MongoDB from markdown
  hash-password.mjs              ← Generate bcrypt hash
src/
  app/
    (admin)/admin/               ← Private admin dashboard
      page.tsx                   ← Dashboard listing
      login/page.tsx             ← Login page
      reflections/new/page.tsx   ← Create reflection
      reflections/[id]/edit/     ← Edit reflection
    api/admin/                   ← Admin API route handlers
      auth/route.ts              ← Login / logout
      reflections/route.ts       ← List + create
      reflections/[id]/route.ts  ← Get + update + delete
    page.tsx                     ← Home (public)
    archive/page.tsx             ← Archive (public)
    reflection/[surah]/[ayah]/   ← Reflection detail (public)
    about/page.tsx               ← About (public)
  components/
    admin/                       ← Admin-only UI components
    download-as-post.tsx         ← Social sharing image generator
    path-aware-shell.tsx         ← Hides navbar/footer on /admin/*
    ...                          ← All other public components unchanged
  lib/
    db-reflections.ts            ← Data layer (MongoDB + markdown fallback)
    db/connection.ts             ← Mongoose connection singleton
    db/reflection-model.ts       ← Mongoose schema + model
    auth.ts                      ← JWT + bcrypt authentication
    site-config.ts               ← Site identity (rebrand here)
    surahs.ts                    ← Surah metadata lookup
```

---

## ☁️ Deploying to Vercel + MongoDB Atlas

1. Create a **MongoDB Atlas** cluster (free tier is fine)
2. Create a database user and get the connection string
3. **Push to GitHub**
4. Import into **Vercel**, set environment variables:
   - `MONGODB_URI` — your Atlas connection string
   - `ADMIN_USERNAME` — your chosen username
   - `ADMIN_PASSWORD_HASH` — bcrypt hash (generate with `scripts/hash-password.mjs`)
   - `JWT_SECRET` — long random string
5. Deploy — done.

---

## 🛠️ Tech stack

- Next.js 15 (App Router, fully dynamic for DB-backed pages)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- MongoDB Atlas + Mongoose
- bcryptjs + jsonwebtoken (admin auth)
- html-to-image (Download as Post)
- gray-matter + reading-time (markdown fallback)
- fuse.js (fuzzy search)
- @fontsource (self-hosted fonts)

No separate backend. Everything is inside a single Next.js project.
