<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<p align="center">
  <a href="https://github.com/AAROOMI/cursormetawocksnavigator/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/AAROOMI/cursormetawocksnavigator/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://github.com/AAROOMI/cursormetawocksnavigator/actions/workflows/deploy-pages.yml">
    <img alt="Deploy" src="https://github.com/AAROOMI/cursormetawocksnavigator/actions/workflows/deploy-pages.yml/badge.svg">
  </a>
  <a href="https://github.com/AAROOMI/cursormetawocksnavigator/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-green.svg">
  </a>
</p>

# Compliance Navigator (Vite + React + Supabase + Clerk + Gemini)

This contains everything you need to run your app locally.

GitHub repo: https://github.com/AAROOMI/cursormetawocksnavigator

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set:
   - `VITE_CLERK_PUBLISHABLE_KEY` (optional for Clerk auth)
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (optional for Supabase backend)
   - `GEMINI_API_KEY` (optional for AI features)
3. Run the app:
   `npm run dev`
