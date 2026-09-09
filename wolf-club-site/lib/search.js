const { expandQuery } = require("./synonyms");

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Score and rank content chunks against a user query, using synonym-expanded
 * keyword overlap (a light BM25-ish count: heading matches weigh more than
 * body matches, expansion terms count as real hits, and duplicates in the
 * expansion set don't double-count against a single occurrence).
 * @param {string} query
 * @param {Array<{page:string,url:string,heading:string,text:string}>} index
 * @param {number} topK
 */
function searchContent(query, index, topK = 5) {
  const expanded = new Set(expandQuery(query));
  if (expanded.size === 0) return [];

  const scored = index.map((chunk) => {
    const headingTokens = new Set(tokenize(chunk.heading));
    const bodyTokens = new Set(tokenize(chunk.text));
    let score = 0;
    for (const term of expanded) {
      const termWords = term.split(/\s+/);
      const phraseHit = chunk.heading.toLowerCase().includes(term) || chunk.text.toLowerCase().includes(term);
      if (termWords.length > 1) {
        // Multi-word synonym phrase — reward exact phrase presence.
        if (chunk.heading.toLowerCase().includes(term)) score += 4;
        else if (chunk.text.toLowerCase().includes(term)) score += 2;
        continue;
      }
      if (headingTokens.has(term)) score += 3;
      else if (bodyTokens.has(term)) score += 1;
      else if (phraseHit) score += 1;
    }
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}

module.exports = { searchContent, tokenize };
