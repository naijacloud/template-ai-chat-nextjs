# AI chat with Next.js

A streaming chat interface for any OpenAI-compatible model, with the key kept on the server.

[![Deploy on Naijacloud](https://img.shields.io/badge/Deploy%20on-Naijacloud-008751)](https://naijacloud.com/new?template=ai-chat-nextjs&ref=template-ai-chat-nextjs)

## Deploy

Click **Deploy** above, or open <https://naijacloud.com/new?template=ai-chat-nextjs&ref=template-ai-chat-nextjs>. Naijacloud builds it from this public repo and gives you a live HTTPS address. No GitHub connection needed; you can switch the service to your own fork later.

## What's inside

- Next.js 15 with the App Router and TypeScript
- A server route at `/api/chat` that streams from `<AI_BASE_URL>/chat/completions`, so the key never reaches the browser
- Works with any OpenAI-compatible API: OpenAI, Groq, Together, OpenRouter, a self-hosted Ollama
- Until the three variables are set, the page shows what is missing instead of failing

## Environment variables

| Name | What it's for | Default |
| --- | --- | --- |
| `AI_BASE_URL` | Your provider's OpenAI-compatible API base URL | None. You set it |
| `AI_API_KEY` | Your provider's key, used only on the server | None. You set it |
| `AI_MODEL` | Model name from your provider | None. You set it |
| `AI_SYSTEM_PROMPT` | Optional system prompt | `You are a helpful, concise assistant.` |

## Run it locally

```sh
git clone https://github.com/naijacloud/template-ai-chat-nextjs
cd template-ai-chat-nextjs
cp .env.example .env   # add your key
npm install
npm run dev
```

## License

MIT
