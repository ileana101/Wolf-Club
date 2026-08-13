(function () {
  var STORAGE_KEY = "wc-nav-sessions-v1";

  var SEED = [
    {
      id: "seed-1",
      name: "Misty Artimire",
      task: "Looking for information for how to create a character",
      version: null,
      status: "satisfied",
      durationMs: (60 + 10) * 60 * 1000, // 1 hour 10 minutes
    },
    {
      id: "seed-2",
      name: "Frankie Finkle",
      task: "Looking for information for how to create a character",
      version: null,
      status: "satisfied",
      durationMs: 30 * 60 * 1000,
    },
    {
      id: "seed-3",
      name: "Nicholas Braun",
      task: "Looking for information for how to create a character",
      version: null,
      status: "satisfied",
      durationMs: 15 * 60 * 1000,
    },
  ];

  var VERSION_LABEL = {
    deviantart: "DeviantArt",
    weebly: "Admin Website",
  };

  var sessions = [];
  var tickHandle = null;

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        sessions = SEED.map(function (s) { return Object.assign({}, s); });
        save();
        return;
      }
      sessions = JSON.parse(raw);
    } catch (err) {
      sessions = SEED.map(function (s) { return Object.assign({}, s); });
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (err) {
      /* localStorage unavailable (private mode, etc.) — state stays in-memory only */
    }
  }

  function formatFinal(ms) {
    var totalMin = Math.round(ms / 60000);
    if (totalMin < 1) return Math.max(1, Math.round(ms / 1000)) + "s";
    var h = Math.floor(totalMin / 60);
    var m = totalMin % 60;
    if (h > 0) return m > 0 ? h + "h " + m + "m" : h + "h";
    return m + "m";
  }

  function formatStopwatch(ms) {
    var totalSec = Math.floor(ms / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    var mm = (m < 10 ? "0" : "") + m;
    var ss = (s < 10 ? "0" : "") + s;
    return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
  }

  function badgeFor(version) {
    if (version === "deviantart") return '<span class="badge badge-deviantart">DeviantArt</span>';
    if (version === "weebly") return '<span class="badge badge-weebly">Admin Website</span>';
    return '<span class="badge badge-none">Not recorded</span>';
  }

  function render() {
    var list = document.getElementById("session-list");
    if (!sessions.length) {
      list.innerHTML = '<li class="empty-state">No sessions logged yet.</li>';
      return;
    }

    list.innerHTML = sessions
      .slice()
      .reverse()
      .map(function (s) {
        var resultHtml;
        if (s.status === "in-progress") {
          var elapsed = Date.now() - s.startedAt;
          resultHtml =
            '<span class="timer" data-timer="' + s.id + '">' + formatStopwatch(elapsed) + "</span>" +
            '<button class="result-btn satisfied" data-action="satisfied" data-id="' + s.id + '">Satisfied</button>' +
            '<button class="result-btn dissatisfied" data-action="dissatisfied" data-id="' + s.id + '">Dissatisfied</button>';
        } else {
          var satChosen = s.status === "satisfied";
          var dissChosen = s.status === "dissatisfied";
          resultHtml =
            '<button class="result-btn satisfied ' + (satChosen ? "chosen" : "unchosen") + '" disabled>' +
              "Satisfied" + (satChosen ? " · " + formatFinal(s.durationMs) : "") +
            "</button>" +
            '<button class="result-btn dissatisfied ' + (dissChosen ? "chosen" : "unchosen") + '" disabled>' +
              "Dissatisfied" + (dissChosen ? " · " + formatFinal(s.durationMs) : "") +
            "</button>";
        }

        return (
          '<li class="session-row" data-row="' + s.id + '">' +
            "<div>" +
              '<div class="session-name">' + escapeHtml(s.name) + badgeFor(s.version) + "</div>" +
              '<div class="session-task">' + escapeHtml(s.task) + "</div>" +
            "</div>" +
            '<div class="session-result">' +
              resultHtml +
              '<button class="remove-btn" data-action="remove" data-id="' + s.id + '" title="Remove">&times;</button>' +
            "</div>" +
          "</li>"
        );
      })
      .join("");

    manageTicking();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function manageTicking() {
    var hasInProgress = sessions.some(function (s) { return s.status === "in-progress"; });
    if (hasInProgress && !tickHandle) {
      tickHandle = setInterval(function () {
        sessions.forEach(function (s) {
          if (s.status !== "in-progress") return;
          var el = document.querySelector('[data-timer="' + s.id + '"]');
          if (el) el.textContent = formatStopwatch(Date.now() - s.startedAt);
        });
      }, 1000);
    } else if (!hasInProgress && tickHandle) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  function startSession(name, task, version) {
    sessions.push({
      id: "s-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      name: name,
      task: task,
      version: version || null,
      status: "in-progress",
      startedAt: Date.now(),
    });
    save();
    render();
  }

  function resolveSession(id, result) {
    var s = sessions.find(function (x) { return x.id === id; });
    if (!s || s.status !== "in-progress") return;
    s.status = result;
    s.endedAt = Date.now();
    s.durationMs = s.endedAt - s.startedAt;
    delete s.startedAt;
    save();
    render();
  }

  function removeSession(id) {
    sessions = sessions.filter(function (x) { return x.id !== id; });
    save();
    render();
  }

  function resetToSeed() {
    if (!window.confirm("Reset sessions to the 3 seed participants? This clears any sessions you've logged.")) return;
    sessions = SEED.map(function (s) { return Object.assign({}, s); });
    save();
    render();
  }

  function scalePreviews() {
    document.querySelectorAll(".card-preview").forEach(function (container) {
      var iframe = container.querySelector("iframe");
      if (!iframe) return;
      var scale = container.clientWidth / 1280;
      iframe.style.transform = "scale(" + scale + ")";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    load();
    render();
    scalePreviews();
    window.addEventListener("resize", scalePreviews);

    document.getElementById("session-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("input-name").value.trim();
      var task = document.getElementById("input-task").value.trim();
      var version = document.getElementById("input-version").value;
      if (!name || !task) return;
      startSession(name, task, version);
      document.getElementById("input-name").value = "";
      document.getElementById("input-name").focus();
    });

    document.getElementById("reset-btn").addEventListener("click", resetToSeed);

    document.getElementById("session-list").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var id = btn.getAttribute("data-id");
      var action = btn.getAttribute("data-action");
      if (action === "satisfied" || action === "dissatisfied") {
        resolveSession(id, action);
      } else if (action === "remove") {
        removeSession(id);
      }
    });
  });
})();
