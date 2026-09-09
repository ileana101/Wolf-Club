// Wolf Club — shared site nav.
// Renders the nav into <div id="wc-nav-root" data-current="..." data-current-href="...">
// so the (growing) dropdown structure lives in exactly one place, then wires up
// hover/click dropdowns and the mobile hamburger accordion.
(function () {
  var NAV = [
    { label: "Home", href: "index.html", key: "home" },
    {
      label: "Joining",
      href: "joining.html",
      key: "joining",
      children: [
        { label: "Joining", href: "joining.html" },
        { label: "Staff", href: "staff.html" },
        { label: "Group Rules", href: "group-rules.html" },
      ],
    },
    {
      label: "Member Guides",
      href: "member-guides.html",
      key: "member-guides",
      children: [
        { label: "Member Guides", href: "member-guides.html" },
        { label: "Bones", href: "bones.html" },
        { label: "Activity Check", href: "activity-check.html" },
        { label: "Character Creation", href: "character-creation.html" },
        { label: "Pack Creation", href: "pack-creation.html" },
        { label: "Mates and Pups", href: "mates-and-pups.html" },
      ],
    },
    {
      label: "Shop",
      href: "shop.html",
      key: "shop",
      children: [
        { label: "Shop", href: "shop.html" },
        { label: "Making Purchases", href: "shop.html#making-purchases" },
      ],
    },
    {
      label: "Packs",
      href: "packs.html",
      key: "packs",
      children: [
        { label: "All Packs", href: "packs.html" },
        { label: "Chandor", href: "chandor.html" },
        { label: "Fellfang", href: "fellfang.html" },
        { label: "Telcoyu", href: "telcoyu.html" },
        { label: "Riverfell", href: "riverfell.html" },
        { label: "Xassa", href: "xassa.html" },
        { label: "Allruh", href: "allruh.html" },
        { label: "Grayard", href: "grayard.html" },
        { label: "Virtus", href: "virtus.html" },
      ],
    },
    { label: "Contact", href: "contact.html", key: "contact" },
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render(root) {
    var current = root.getAttribute("data-current") || "";
    var currentHref = root.getAttribute("data-current-href") || "";

    var itemsHtml = NAV.map(function (item) {
      var isCurrentTop = item.key === current;
      if (!item.children) {
        return (
          '<li class="wc-menu-item">' +
          '<a class="wc-menu-link' + (isCurrentTop ? " is-current" : "") + '" href="' +
          item.href + '">' + escapeHtml(item.label) + "</a></li>"
        );
      }
      var dropdown = item.children
        .map(function (child) {
          var isCurrentChild = currentHref && child.href.split("#")[0] === currentHref.split("#")[0] &&
            (child.href.indexOf("#") === -1 || child.href === currentHref);
          var classes = [];
          if (child.inert) classes.push("is-inert");
          if (isCurrentChild) classes.push("is-current");
          return (
            '<a' + (classes.length ? ' class="' + classes.join(" ") + '"' : "") +
            ' href="' + child.href + '"' + (child.inert ? ' title="Coming soon"' : "") + '>' +
            escapeHtml(child.label) + "</a>"
          );
        })
        .join("");
      return (
        '<li class="wc-menu-item">' +
        '<button class="wc-menu-link' + (isCurrentTop ? " is-current" : "") +
        '" type="button" aria-expanded="false">' + escapeHtml(item.label) +
        ' <span class="wc-caret" aria-hidden="true">▾</span></button>' +
        '<div class="wc-dropdown">' + dropdown + "</div></li>"
      );
    }).join("");

    // The nav IS #wc-nav-root (rather than an inner <header>) so that the
    // sticky element's containing block is <body> — not a wrapper div that
    // auto-shrinks to the nav's own height and would cancel the sticking.
    root.classList.add("wc-nav");
    root.setAttribute("role", "banner");
    root.innerHTML =
      '<div class="wc-nav-inner">' +
      '<div class="wc-nav-left">' +
      '<a class="wc-logo" href="index.html">Wolf Club</a>' +
      '<button class="wc-hamburger" type="button" aria-label="Toggle menu" aria-expanded="false">' +
      "<span></span><span></span><span></span></button>" +
      "</div>" +
      '<nav aria-label="Primary"><ul class="wc-menu">' + itemsHtml + "</ul></nav>" +
      '<form class="wc-search" role="search" autocomplete="off">' +
      '<span aria-hidden="true">🔍</span>' +
      '<input type="search" placeholder="Search…" aria-label="Search Wolf Club" />' +
      '<div class="wc-search-results" hidden></div>' +
      "</form>" +
      "</div>";
  }

  function wireInteractions(nav) {
    var hamburger = nav.querySelector(".wc-hamburger");
    var items = Array.prototype.slice.call(nav.querySelectorAll(".wc-menu-item"));

    function closeAllDropdowns(except) {
      items.forEach(function (item) {
        if (item !== except) item.classList.remove("is-open");
      });
    }

    function closeMenu() {
      nav.classList.remove("is-menu-open");
      if (hamburger) hamburger.setAttribute("aria-expanded", "false");
      closeAllDropdowns();
    }

    if (hamburger) {
      hamburger.addEventListener("click", function () {
        var open = nav.classList.toggle("is-menu-open");
        hamburger.setAttribute("aria-expanded", open ? "true" : "false");
        if (!open) closeAllDropdowns();
      });
    }

    items.forEach(function (item) {
      var link = item.querySelector(".wc-menu-link");
      var dropdown = item.querySelector(".wc-dropdown");
      if (!dropdown || link.tagName !== "BUTTON") return;

      link.addEventListener("click", function (e) {
        e.preventDefault();
        var willOpen = !item.classList.contains("is-open");
        closeAllDropdowns(item);
        item.classList.toggle("is-open", willOpen);
      });
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      closeAllDropdowns();
    });
  }

  // Wires the nav search box to the same synonym-aware lexical search that
  // powers the chatbot (window.WolfClubSearch / window.WolfClubContentIndex,
  // loaded from lib/search.js, lib/synonyms.js, lib/content-index.js), so
  // typing a query and hitting Enter (or picking a result) actually
  // navigates to the matching page instead of doing nothing.
  function wireSearch(nav) {
    var form = nav.querySelector(".wc-search");
    var input = form && form.querySelector("input");
    var results = form && form.querySelector(".wc-search-results");
    if (!form || !input || !results) return;
    if (!window.WolfClubSearch || !window.WolfClubContentIndex) return;

    var matches = [];
    var debounceTimer = null;

    function renderResults() {
      var query = input.value.trim();
      if (query.length < 2) {
        matches = [];
        results.hidden = true;
        results.innerHTML = "";
        return;
      }
      matches = window.WolfClubSearch.searchContent(query, window.WolfClubContentIndex.CONTENT_INDEX, 6);
      if (matches.length === 0) {
        results.innerHTML = '<div class="wc-search-empty">No matching pages — try a different word.</div>';
        results.hidden = false;
        return;
      }
      results.innerHTML = matches
        .map(function (m, i) {
          return (
            '<a href="' + m.url + '" class="wc-search-result" data-index="' + i + '">' +
            '<span class="wc-search-result-page">' + escapeHtml(m.page) + "</span>" +
            '<span class="wc-search-result-heading">' + escapeHtml(m.heading) + "</span>" +
            "</a>"
          );
        })
        .join("");
      results.hidden = false;
    }

    input.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(renderResults, 150);
    });

    input.addEventListener("focus", function () {
      if (input.value.trim().length >= 2) renderResults();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (matches.length > 0) {
        window.location.href = matches[0].url;
      }
    });

    document.addEventListener("click", function (e) {
      if (!form.contains(e.target)) {
        results.hidden = true;
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        results.hidden = true;
        input.blur();
      }
    });
  }

  function init() {
    var root = document.getElementById("wc-nav-root");
    if (!root) return;
    render(root);
    wireInteractions(root);
    wireSearch(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
