import Chat from './chat';
import { aiConfig, missingSettings } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export default function Home() {
  const config = aiConfig();
  return (
    <main className="shell">
      <header className="bar">
        <span className="logo" aria-hidden="true" />
        <span className="name">Chat</span>
        {config ? <span className="model">{config.model}</span> : null}
      </header>
      {config ? (
        <Chat />
      ) : (
        <section className="setup">
          <p className="eyebrow">One step left</p>
          <h1>Connect a model to start chatting.</h1>
          <p className="lead">
            This app talks to any OpenAI-compatible API. Add these variables to the service, then
            restart it:
          </p>
          <ul>
            {['AI_BASE_URL', 'AI_API_KEY', 'AI_MODEL'].map((k) => (
              <li key={k} className={missingSettings().includes(k) ? 'missing' : 'set'}>
                <code>{k}</code>
                <span>{missingSettings().includes(k) ? 'missing' : 'set'}</span>
              </li>
            ))}
          </ul>
          <p className="hint">
            For example <code>https://api.openai.com/v1</code> with <code>gpt-4o-mini</code>, or{' '}
            <code>https://api.groq.com/openai/v1</code> with a Llama model.
          </p>
        </section>
      )}
    </main>
  );
}
