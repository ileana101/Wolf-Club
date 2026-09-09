const { CONTENT_INDEX } = require("../lib/content-index");
const { searchContent } = require("../lib/search");

const MODEL = "claude-opus-5";
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_TURNS = 6;

function dedupeSources(chunks) {
  const seen = new Set();
  const sources = [];
  for (const chunk of chunks) {
    if (seen.has(chunk.url)) continue;
    seen.add(chunk.url);
    sources.push({ page: chunk.page, url: chunk.url, heading: chunk.heading });
  }
  return sources;
}

function lexicalFallbackReply(query, matches) {
  if (matches.length === 0) {
    return "I couldn't find anything in the Wolf Club pages that matches that — try rephrasing, or ask on Discord / Note WCAdmin. (Note: the full AI assistant isn't configured yet on this deployment, so I'm only doing keyword search right now.)";
  }
  const lines = matches
    .slice(0, 4)
    .map((m) => `• **${m.heading}** (${m.page}) — ${m.text}`)
    .join("\n\n");
  return (
    "Here's what I found on the site that looks related (keyword search only — " +
    "the full AI assistant isn't configured yet on this deployment):\n\n" +
    lines
  );
}

async function callClaude(message, history, matches) {
  // Loaded lazily so the function still works in lexical-only mode when the
  // package isn't needed / installed in a minimal deployment.
  const Anthropic = require("@anthropic-ai/sdk");
  const client = new Anthropic();

  const context = matches
    .map((m, i) => `[${i + 1}] ${m.page} — ${m.heading}\n${m.text}\nLink: ${m.url}`)
    .join("\n\n");

  const system = `You are the Wolf Club site assistant, embedded on wolfclub's own website. Wolf Club is a semi-realistic wolf art & roleplay community.

Answer the visitor's question using ONLY the excerpts below, pulled from the site's own pages. Members often use casual or niche phrasing (e.g. "currency" for bones, "puppy" for pup, "leader" for alpha) — interpret their question generously against these excerpts.

Rules:
- If the excerpts answer the question, answer it plainly and concisely (a few sentences, or a short list for multi-part rules/costs). Cite which page(s) the info comes from by name, e.g. "(see the Bones Currency System page)".
- If the excerpts don't cover it, say you don't see that covered on the site yet and suggest they Note WCAdmin or ask on Discord — do not invent rules, costs, or numbers.
- Keep answers short and friendly. This is a chat widget, not an essay.

Site excerpts:
${context || "(no matching excerpts found)"}`;

  const messages = history
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({ role: turn.role === "assistant" ? "assistant" : "user", content: String(turn.content).slice(0, MAX_MESSAGE_LENGTH) }));
  messages.push({ role: "user", content: message });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system,
    output_config: { effort: "low" },
    messages,
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text : "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
  }

  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body?.history) ? body.history : [];

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer` });
    return;
  }

  const matches = searchContent(message, CONTENT_INDEX, 5);
  const sources = dedupeSources(matches);

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(200).json({
      reply: lexicalFallbackReply(message, matches),
      sources,
      mode: "lexical",
    });
    return;
  }

  try {
    const reply = await callClaude(message, history, matches);
    res.status(200).json({ reply, sources, mode: "ai" });
  } catch (err) {
    console.error("chat handler error:", err);
    res.status(200).json({
      reply: lexicalFallbackReply(message, matches) + "\n\n(The AI assistant hit an error, so this is a keyword-search fallback.)",
      sources,
      mode: "lexical-error",
    });
  }
};
