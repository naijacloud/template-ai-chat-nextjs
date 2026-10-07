import { aiConfig } from '@/lib/ai';

export const dynamic = 'force-dynamic';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM = process.env.AI_SYSTEM_PROMPT || 'You are a helpful, concise assistant.';

/**
 * POST { messages } → a plain-text stream of the assistant's reply.
 *
 * Calls `<AI_BASE_URL>/chat/completions` with `stream: true` and forwards only
 * the text deltas, so the browser never sees the key or the provider's format.
 */
export async function POST(req: Request) {
  const config = aiConfig();
  if (!config) {
    return Response.json(
      { error: 'Set AI_BASE_URL, AI_API_KEY and AI_MODEL on the service.' },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => null)) as { messages?: ChatMessage[] } | null;
  const messages = (body?.messages ?? [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-20);
  if (!messages.length) {
    return Response.json({ error: 'Send at least one message.' }, { status: 400 });
  }

  const upstream = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      stream: true,
      messages: [{ role: 'system', content: SYSTEM }, ...messages],
    }),
  }).catch((err: Error) => err);

  if (upstream instanceof Error || !upstream.ok || !upstream.body) {
    const detail =
      upstream instanceof Error
        ? upstream.message
        : `${upstream.status} ${await upstream.text().catch(() => '')}`.slice(0, 300);
    return Response.json({ error: `The model provider refused the request: ${detail}` }, { status: 502 });
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const data = line.replace(/^data:\s*/, '').trim();
        if (!line.startsWith('data:') || !data || data === '[DONE]') continue;
        try {
          const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        } catch {
          // A keep-alive or a partial line: skip it.
        }
      }
    },
    cancel() {
      void reader.cancel();
    },
  });

  return new Response(stream, {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });
}
