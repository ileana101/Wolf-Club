// Domain thesaurus for Wolf Club's niche/in-group vocabulary.
// Maps each canonical site term to plain-language synonyms a new or
// confused member might type instead, so search matches "how do I get
// currency" against a page that only ever says "bones".
//
// Keys and values are all lowercase; expansion is symmetric (matching any
// synonym pulls in the canonical term and its siblings).
const SYNONYM_GROUPS = [
  ["bones", "currency", "points", "money", "credits", "cash", "coins"],
  ["mate", "mates", "partner", "spouse", "boyfriend", "girlfriend", "husband", "wife", "significant other", "so", "marriage", "courtship", "dating"],
  ["pup", "pups", "puppy", "puppies", "cub", "baby", "babies", "litter", "offspring", "newborn"],
  ["pack", "packs", "clan", "faction", "group", "tribe"],
  ["alpha", "alphas", "leader", "leaders", "chief", "boss"],
  ["loner", "loners", "lone wolf", "solo", "independent", "unaffiliated"],
  ["familiar", "familiars", "pet", "companion", "sidekick", "animal companion"],
  ["application", "app", "apps", "sign up", "signup", "join form", "form", "reference sheet", "ref sheet"],
  ["joining", "join", "applying", "apply", "become a member", "get in", "membership"],
  ["activity check", "ac", "check-in", "checkin", "inactivity", "inactive"],
  ["mse", "monthly special event", "event", "prompt", "prompts", "meme", "memes"],
  ["retire", "retirement", "retiring", "quit", "leave the group", "give up", "kill off", "death", "deceased"],
  ["rank", "ranks", "title", "titles", "position", "role", "status", "promotion", "rank up", "rank-up"],
  ["mutation", "mutations", "deformity", "birth defect", "limb loss"],
  ["staff", "admin", "admins", "administrators", "moderator", "moderators", "mods", "council"],
  ["pack leader", "pack leaders", "alpha", "faction leader"],
  ["scribe", "scribes", "co-leader", "deputy"],
  ["guardian", "guardians", "caretaker", "babysitter", "custodian"],
  ["pregnancy", "pregnant", "expecting", "having pups", "having a litter"],
  ["bone cashing", "cashing bones", "submitting bones", "turning in bones", "logging bones"],
  ["wcadmin", "wc admin", "the admin account", "group admin"],
  ["mod ticket", "ticket", "discord ticket", "support ticket"],
  ["note", "notes", "deviantart note", "message", "dm"],
  ["canon", "official", "counts", "counted"],
  ["ooc", "out of character", "out-of-character"],
  ["ic", "in character", "in-character"],
  ["character of the season", "cots", "character of the month", "featured character", "monthly winner"],
  ["code of conduct", "coc", "conduct rules", "behavior rules"],
  ["strike system", "strikes", "warnings", "three strikes"],
  ["disbanded pack", "disbanded packs", "former pack", "old pack", "defunct pack"],
  ["other creatures", "other creature", "non-wolf", "not a wolf", "different species"],
  ["hybrid", "wolfdog", "wolf-hybrid", "wolf hybrid", "coywolf"],
  ["design guide", "markings", "marking", "coat", "fur pattern", "colors", "coloring"],
  ["height and weight", "size", "how big", "how tall", "how heavy"],
  ["shop", "store", "buy", "purchase", "purchasing", "spend bones"],
  ["gallery", "art page", "portfolio"],
  ["discord", "server", "chat"],
];

const CANONICAL_BY_TERM = new Map();
for (const group of SYNONYM_GROUPS) {
  const canonical = group[0];
  for (const term of group) {
    CANONICAL_BY_TERM.set(term, canonical);
  }
}

// Sort longest-first so multi-word phrases ("activity check") match before
// their component words do.
const ALL_TERMS = Array.from(CANONICAL_BY_TERM.keys()).sort((a, b) => b.length - a.length);

/**
 * Expand a free-text query into the set of canonical terms it touches,
 * plus every synonym of each of those terms. Used to widen lexical search
 * so niche in-group words and everyday synonyms both work.
 * @param {string} query
 * @returns {string[]} lowercase expansion terms (includes original query words)
 */
function expandQuery(query) {
  const lower = " " + query.toLowerCase().replace(/[^a-z0-9\s-]/g, " ") + " ";
  const expansions = new Set();

  for (const term of ALL_TERMS) {
    if (lower.includes(" " + term + " ") || lower.includes(" " + term)) {
      const canonical = CANONICAL_BY_TERM.get(term);
      for (const group of SYNONYM_GROUPS) {
        if (group[0] === canonical) {
          group.forEach((t) => expansions.add(t));
        }
      }
    }
  }

  // Always include the raw tokens too, so plain keyword matches still work
  // for words that aren't part of any synonym group.
  lower
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .forEach((w) => expansions.add(w));

  return Array.from(expansions);
}

module.exports = { expandQuery, SYNONYM_GROUPS };
