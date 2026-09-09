// Wolf Club — "Ask Wolf Club" chatbot widget.
// Injects a floating launcher + chat panel on every page and talks to
// /api/chat (a Vercel serverless function that does synonym-aware search
// over the site's own content, then — if ANTHROPIC_API_KEY is configured —
// asks Claude to answer using only that retrieved context).
(function () {
  var history = [];

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      node.appendChild(c);
    });
    return node;
  }

  function build() {
    var launcher = el("button", {
      class: "wc-chat-launcher",
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": "false",
    });
    launcher.innerHTML = '<span aria-hidden="true">🐾</span> Ask Wolf Club';

    var panel = el("section", {
      class: "wc-chat-panel",
      role: "dialog",
      "aria-label": "Ask Wolf Club chat assistant",
      hidden: "hidden",
    });

    var header = el("div", { class: "wc-chat-header" });
    header.innerHTML = '<span>🐾 Ask Wolf Club</span>';
    var closeBtn = el("button", { type: "button", "aria-label": "Close chat" });
    closeBtn.textContent = "×";
    header.appendChild(closeBtn);

    var messages = el("div", { class: "wc-chat-messages" });
    var intro = el("div", { class: "wc-chat-msg wc-chat-msg-bot" });
    intro.textContent =
      "Hi! Ask me anything about joining, bones, packs, characters, or the rules — I search the whole site, so feel free to use your own words.";
    messages.appendChild(intro);

    var hint = el("div", { class: "wc-chat-hint" });
    hint.textContent = "Answers are generated from this site's own pages.";

    var form = el("form", { class: "wc-chat-form" });
    var input = el("input", {
      type: "text",
      placeholder: "e.g. how do I earn currency?",
      "aria-label": "Your question",
      autocomplete: "off",
    });
    var sendBtn = el("button", { type: "submit" });
    sendBtn.textContent = "Send";
    form.appendChild(input);
    form.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(hint);
    panel.appendChild(form);

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    function openPanel() {
      panel.hidden = false;
      launcher.setAttribute("aria-expanded", "true");
      launcher.hidden = true;
      input.focus();
    }
    function closePanel() {
      panel.hidden = true;
      launcher.setAttribute("aria-expanded", "false");
      launcher.hidden = false;
    }

    launcher.addEventListener("click", openPanel);
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) closePanel();
    });

    function addUserMessage(text) {
      var msg = el("div", { class: "wc-chat-msg wc-chat-msg-user" });
      msg.textContent = text;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function addBotMessage(text, sources) {
      var msg = el("div", { class: "wc-chat-msg wc-chat-msg-bot" });
      msg.textContent = text;
      messages.appendChild(msg);
      if (sources && sources.length) {
        var row = el("div", { class: "wc-chat-sources" });
        sources.forEach(function (s) {
          var a = el("a", { href: s.url });
          a.textContent = s.page;
          row.appendChild(a);
        });
        messages.appendChild(row);
      }
      messages.scrollTop = messages.scrollHeight;
    }

    function addLoadingMessage() {
      var msg = el("div", { class: "wc-chat-msg wc-chat-msg-bot is-loading" });
      msg.textContent = "Thinking…";
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
      return msg;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = "";
      input.disabled = true;
      sendBtn.disabled = true;

      addUserMessage(text);
      var loadingEl = addLoadingMessage();

      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history }),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          loadingEl.remove();
          if (!result.ok) {
            addBotMessage(
              (result.data && result.data.error) ||
                "Something went wrong reaching the chat assistant."
            );
            return;
          }
          var reply = result.data.reply || "I'm not sure how to answer that.";
          addBotMessage(reply, result.data.sources);
          history.push({ role: "user", content: text });
          history.push({ role: "assistant", content: reply });
          if (history.length > 12) history = history.slice(-12);
        })
        .catch(function () {
          loadingEl.remove();
          addBotMessage(
            "I couldn't reach the chat assistant just now — please try again in a moment."
          );
        })
        .finally(function () {
          input.disabled = false;
          sendBtn.disabled = false;
          input.focus();
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
