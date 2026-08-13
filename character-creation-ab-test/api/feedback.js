// Vercel serverless function (Node runtime). No database — logs each
// submission so it shows up in `vercel logs` / the Vercel dashboard.
// Deliberately minimal: this A/B test doesn't need persistent storage.
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch (err) {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }
  }

  const { variant, foundIt, comment, page, ts } = body || {};

  if (variant !== "weebly" && variant !== "deviantart") {
    res.status(400).json({ error: "Invalid variant" });
    return;
  }
  if (foundIt !== "yes" && foundIt !== "no") {
    res.status(400).json({ error: "Invalid foundIt value" });
    return;
  }

  console.log(
    "[character-creation-ab-test feedback]",
    JSON.stringify({
      variant,
      foundIt,
      comment: typeof comment === "string" ? comment.slice(0, 500) : "",
      page: typeof page === "string" ? page.slice(0, 200) : "",
      ts: typeof ts === "string" ? ts : new Date().toISOString(),
    })
  );

  res.status(200).json({ ok: true });
};
