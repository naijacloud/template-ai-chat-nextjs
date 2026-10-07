/**
 * The model provider, from environment variables read at request time. Any
 * OpenAI-compatible endpoint works: OpenAI, Groq, Together, OpenRouter, a local
 * Ollama, or your own gateway.
 */
export interface AiConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export function aiConfig(): AiConfig | null {
  const baseUrl = process.env.AI_BASE_URL?.trim().replace(/\/+$/, '');
  const apiKey = process.env.AI_API_KEY?.trim();
  const model = process.env.AI_MODEL?.trim();
  if (!baseUrl || !apiKey || !model) return null;
  return { baseUrl, apiKey, model };
}

/** Which of the three settings are missing, for the setup screen. */
export function missingSettings(): string[] {
  return (['AI_BASE_URL', 'AI_API_KEY', 'AI_MODEL'] as const).filter(
    (k) => !process.env[k]?.trim(),
  );
}
