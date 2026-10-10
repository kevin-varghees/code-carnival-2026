import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  LoaderCircle,
  MessageCircle,
  LogIn,
} from 'lucide-react';
import api, { errMsg } from '../api/client';

const suggestions = [
  'How do I register for an event?',
  'Where can I find my tickets?',
  'Help me find a campus event',
];

const welcomeMessage = {
  role: 'assistant',
  content:
    "Hey! 👋 I'm EventEase AI. I can help with campus events, registrations, tickets, schedules, and team formation. What would you like to know?",
};

export default function AIChatWidget({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isAuthenticated =
    Boolean(user) && Boolean(localStorage.getItem('token'));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      inputRef.current?.focus();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(event) {
      if (event.key === 'Escape') setIsOpen(false);
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  async function sendMessage(text = input) {
    const content = text.trim();

    if (!content || isSending) return;

    if (!isAuthenticated) {
      setError('Please sign in to chat with EventEase AI.');
      return;
    }

    const previousMessages = messages.filter(
      (message) => message !== welcomeMessage
    );

    const nextMessages = [
      ...messages,
      { role: 'user', content },
    ];

    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsSending(true);

    try {
      const history = previousMessages.slice(-20).map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await api.post('/api/ai/chat', {
        message: content,
        history,
      });

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: response.data.message,
        },
      ]);
    } catch (err) {
      setError(
        err?.response?.status === 401
          ? 'Your session may have expired. Please sign in again.'
          : errMsg(err, 'EventEase AI could not reply. Please try again.')
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="fixed bottom-3 right-3 z-[100] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6 sm:gap-3">
      {isOpen && (
        <section
          aria-label="EventEase AI chat"
          className="ai-chat-panel flex h-[min(620px,calc(100dvh-6rem))] max-h-[calc(100dvh-6rem)] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl border border-emerald-500/25 bg-[#080d0b]/95 text-zinc-100 shadow-[0_24px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-emerald-950/70 to-[#080d0b] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
                <Bot size={23} />
              </div>
              <div>
                <h2 className="font-semibold tracking-wide">EventEase AI</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Campus event assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={19} />
            </button>
          </header>

          {!isAuthenticated ? (
            <div className="flex flex-1 flex-col items-center justify-center px-7 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <LogIn size={28} />
              </div>
              <h3 className="text-lg font-semibold">Welcome to EventEase AI</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Sign in to chat with your campus event assistant and get help
                with registrations, tickets, and more.
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/login';
                }}
                className="mt-5 rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-300"
              >
                Sign in to continue
              </button>
            </div>
          ) : (
            <>
              <div
                className="flex-1 space-y-4 overflow-y-auto px-4 py-5"
                aria-live="polite"
              >
                {messages.map((message, index) => (
                  <div
                    key={`${index}-${message.role}`}
                    className={`ai-chat-message-enter flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                        message.role === 'user'
                          ? 'rounded-br-md bg-emerald-400 text-[#04110a]'
                          : 'rounded-bl-md border border-white/[0.07] bg-white/[0.05] text-zinc-200'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {messages.length === 1 && (
                  <div className="pt-2">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                      Try asking
                    </p>
                    <div className="flex flex-col items-start gap-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          disabled={isSending}
                          onClick={() => sendMessage(suggestion)}
                          className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-2 text-left text-xs text-emerald-100/90 transition hover:border-emerald-400/50 hover:bg-emerald-400/10 disabled:opacity-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isSending && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <LoaderCircle size={15} className="animate-spin text-emerald-300" />
                    EventEase AI is thinking…
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {error && (
                <div
                  role="alert"
                  className="mx-4 mb-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs leading-5 text-red-200"
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="border-t border-white/10 bg-black/20 p-3"
              >
                <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 transition focus-within:border-emerald-400/40">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit(event);
                      }
                    }}
                    placeholder="Ask about campus events…"
                    aria-label="Message EventEase AI"
                    rows={1}
                    maxLength={4000}
                    disabled={isSending}
                    className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    aria-label="Send message"
                    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    {isSending ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-center text-[10px] text-zinc-600">
                  AI can make mistakes. Verify important event details.
                </p>
              </form>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close EventEase AI' : 'Open EventEase AI'}
        aria-expanded={isOpen}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/40 bg-gradient-to-br from-emerald-300 to-emerald-500 text-[#031109] shadow-[0_0_30px_rgba(16,185,129,0.24)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-95"
      >
        <span className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
        {isOpen ? (
          <X size={23} />
        ) : (
          <>
            <MessageCircle size={24} />
            <Sparkles
              size={13}
              className="absolute right-2 top-2 transition group-hover:rotate-12"
            />
          </>
        )}
      </button>
    </div>
  );
}
