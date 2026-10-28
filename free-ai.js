// free-ai-anywhere: ask an AI using only FREE tiers that need NO credit card.
// It tries each free provider in order and moves to the next one when one is busy or out for the day.
// Made by Metamorphosis (https://www.metamorphosis.garden), a free AI playground. MIT license.
//
// Usage:
//   import { askFreeAI } from "./free-ai.js";
//   const { text, provider } = await askFreeAI("Write a haiku about Minnesota", {
//     keys: { openrouter: "...", groq: "...", gemini: "..." },   // any you have; skip the rest
//     cloudflareAI: env.AI,                                      // optional: Cloudflare Workers AI binding
//   });

const PROVIDERS = [
  { name: "groq", url: "https://api.groq.com/openai/v1/chat/completions", models: ["openai/gpt-oss-120b", "llama-3.3-70b-versatile"] },
  { name: "gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", models: ["gemini-flash-latest", "gemini-flash-lite-latest"] },
  { name: "openrouter", url: "https://openrouter.ai/api/v1/chat/completions", models: ["meta-llama/llama-3.3-70b-instruct:free", "deepseek/deepseek-chat-v3-0324:free"] },
];
const cooldown = {}; // provider -> time it's OK to try again

export async function askFreeAI(prompt, { keys = {}, cloudflareAI = null, maxTokens = 500, temperature = 0.7, timeoutMs = 15000, order } = {}) {
  const list = order ? order.map((n) => PROVIDERS.find((p) => p.name === n)).filter(Boolean) : PROVIDERS;
  for (const p of list) {
    const key = keys[p.name];
    if (!key || (cooldown[p.name] || 0) > Date.now()) continue;
    for (const model of p.models) {
      try {
        const r = await fetch(p.url, {
          method: "POST",
          signal: AbortSignal.timeout(timeoutMs),
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model, max_tokens: maxTokens, temperature, messages: [{ role: "user", content: prompt }],
            ...(/gpt-oss/.test(model) ? { reasoning_effort: "low" } : {}) }),
        });
        if (r.status === 429) { cooldown[p.name] = Date.now() + 15 * 60 * 1000; break; } // out for now: next provider
        if (r.status === 401 || r.status === 403) break;                                  // bad key: next provider
        if (!r.ok) continue;                                                              // busy model: next model
        const j = await r.json();
        const text = String(j?.choices?.[0]?.message?.content || "").replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        if (text) return { text, provider: p.name, model };
      } catch { /* timeout or network: try the next one */ }
    }
  }
  if (cloudflareAI) {
    try {
      const out = await cloudflareAI.run("@cf/meta/llama-3.1-8b-instruct-fast", { messages: [{ role: "user", content: prompt }], max_tokens: maxTokens });
      if (out?.response) return { text: String(out.response).trim(), provider: "cloudflare", model: "llama-3.1-8b-instruct-fast" };
    } catch {}
  }
  throw new Error("All free AI sources are busy or out for today. Try again later.");
}
