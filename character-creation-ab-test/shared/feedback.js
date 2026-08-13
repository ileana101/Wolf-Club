/*
 * Findability feedback widget for the Wolf Club character-creation A/B test.
 * Mounted on both variants with a different `variant` label so results are
 * comparable. Logs to Vercel Web Analytics custom events (if enabled on the
 * deployment) and to /api/feedback (visible in Vercel function logs).
 */
(function () {
  function mountFeedbackWidget(variant) {
    var storageKey = "wc-ab-feedback-" + variant;
    if (sessionStorage.getItem(storageKey) === "sent") return;

    var wrap = document.createElement("div");
    wrap.className = "wc-feedback-widget";
    wrap.innerHTML =
      '<div class="wc-feedback-card">' +
      '  <button type="button" class="wc-feedback-close" aria-label="Dismiss">&times;</button>' +
      '  <p class="wc-feedback-question">Did you find what you needed to make a character?</p>' +
      '  <div class="wc-feedback-buttons">' +
      '    <button type="button" data-answer="yes" class="wc-feedback-btn wc-feedback-yes">Yes</button>' +
      '    <button type="button" data-answer="no" class="wc-feedback-btn wc-feedback-no">No</button>' +
      "  </div>" +
      '  <div class="wc-feedback-followup" hidden>' +
      '    <textarea maxlength="500" placeholder="Optional: what helped, or what was confusing/hard to find?"></textarea>' +
      '    <button type="button" class="wc-feedback-submit">Submit</button>' +
      "  </div>" +
      '  <p class="wc-feedback-thanks" hidden>Thanks &mdash; that helps a lot!</p>' +
      "</div>";
    document.body.appendChild(wrap);

    var followup = wrap.querySelector(".wc-feedback-followup");
    var thanks = wrap.querySelector(".wc-feedback-thanks");
    var buttons = wrap.querySelector(".wc-feedback-buttons");
    var textarea = wrap.querySelector("textarea");
    var chosenAnswer = null;

    function send(foundIt, comment) {
      var payload = {
        variant: variant,
        foundIt: foundIt,
        comment: (comment || "").slice(0, 500),
        page: location.pathname,
        ts: new Date().toISOString(),
      };

      if (window.va) {
        window.va("event", {
          name: "character_creation_feedback",
          data: { variant: variant, foundIt: foundIt },
        });
      }

      fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(function () {
        /* best-effort only; do not block the UI on network issues */
      });

      sessionStorage.setItem(storageKey, "sent");
    }

    wrap.querySelector(".wc-feedback-close").addEventListener("click", function () {
      wrap.remove();
    });

    wrap.querySelectorAll(".wc-feedback-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        chosenAnswer = btn.getAttribute("data-answer");
        buttons.hidden = true;
        followup.hidden = false;
        textarea.focus();
      });
    });

    wrap.querySelector(".wc-feedback-submit").addEventListener("click", function () {
      send(chosenAnswer, textarea.value);
      followup.hidden = true;
      thanks.hidden = false;
      setTimeout(function () {
        wrap.remove();
      }, 2200);
    });
  }

  window.mountFeedbackWidget = mountFeedbackWidget;
})();
