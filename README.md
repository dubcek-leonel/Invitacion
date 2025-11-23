<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ID0RSQ74uL-JX6pveW3QVnjsLHuSbbUi

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase

This project can optionally persist attendees to Supabase. The app reads the following Vite env variables:

- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — your Supabase public (publishable) key

You can copy the example env file and run locally:

```bash
cp .env.example .env.local
# or create .env.local and add the values
npm run dev
```

The repository includes an `.env.example` with the provided project URL and publishable key.
