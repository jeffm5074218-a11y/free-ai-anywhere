# free-ai-anywhere 🦋

**Ask an AI for free, with no credit card on file anywhere.**

One small JavaScript file that tries several free AI services in a row. When one is busy or out of free answers for the day, it moves on to the next. Nothing can surprise-charge you, because none of these need a card. When they run out, they just say "come back tomorrow."

Built for and used by **[Metamorphosis](https://www.metamorphosis.garden)**, a free AI playground where teams of free AIs hold meetings, build games and run a little glowing town. No sign-up. [Come try it →](https://www.metamorphosis.garden)

## Free sources it uses (no card needed)

| Source | How to get a free key | Notes |
|---|---|---|
| **Groq** | console.groq.com → API Keys | Very fast. Big open models. |
| **Google Gemini** | aistudio.google.com → Get API key | Strong models. Sometimes busy at peak times. |
| **OpenRouter** | openrouter.ai → Keys | Many free models, small daily limit. |
| **Cloudflare Workers AI** | Add an "AI" binding to your Worker or Pages project | Free daily amount on the free plan. Great last backup. |

Free limits and model names change over time. Check each site for current rules, and follow each provider's terms.

## Use it

```js
import { askFreeAI } from "./free-ai.js";

const { text, provider } = await askFreeAI("Give me 3 names for a bakery", {
  keys: { groq: GROQ_KEY, gemini: GEMINI_KEY, openrouter: OPENROUTER_KEY },
  cloudflareAI: env.AI, // optional
});
console.log(provider, text);
```

Keep your keys on your server (never in a web page anyone can see).

## See it in action

- 🧠 **[AI Boardroom](https://www.metamorphosis.garden/boardroom)**: five free AIs hold a meeting about your idea
- 🛠️ **[Workshop](https://www.metamorphosis.garden/workshop)**: say what you want and a free AI builds it
- 🏙️ **[Metamorphosis Town](https://www.metamorphosis.garden/town)**: build on an empty lot and the AIs design your building

## License

MIT. Free to use, change and share.
