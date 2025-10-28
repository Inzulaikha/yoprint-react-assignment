# Anime Finder App

A Vite + React + TypeScript project using the **Jikan API** to search anime titles with integrated **Safe Mode (NSFW filter)**.

---

## 🚀 Features
- 🔍 Live anime search (powered by Jikan API)
- 📱 Fully responsive grid layout
- 💬 Debounced input for smooth search
- 🧠 Redux Toolkit for state management
- 🪄 Skeleton loaders for better UX
Bonus Implementation
- ⚙️ Safe Mode toggle to block NSFW (R+ / Rx) content
- 🧭 Pagination (15 items per page)

---

## 🧩 Tech Stack
| Area | Tools / Libraries |
|------|--------------------|
| Frontend | React + TypeScript + Vite |
| State Management | Redux Toolkit |
| API | [Jikan API v4](https://docs.api.jikan.moe) |
| Styling | CSS3, Responsive Grid |
| Deployment | Netlify |
| AI Support | ChatGPT (debugging) |

---

## ⚙️ Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

App will run at: **http://localhost:4000**

---

## 🧠 Safe Mode & NSFW Handling
- When **Safe Mode** is ON:
  - NSFW keywords like *hentai, r18, nsfw, etc.* are cleared instantly.
  - Results rated **R+** or **Rx** are hidden.
- When **Safe Mode** is OFF:
  - All anime are visible.
- Search results always show up to **15 cards per page**.

---

