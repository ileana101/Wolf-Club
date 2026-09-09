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
        { label: "Chandor", href: "packs.html#chandor" },
        { label: "Fellfang", href: "packs.html#fellfang" },
        { label: "Telcoyu", href: "packs.html#telcoyu" },
        { label: "Riverfell", href: "packs.html#riverfell" },
        { label: "Xassa", href: "packs.html#xassa" },
        { label: "Allruh", href: "packs.html#allruh" },
        { label: "Grayard", href: "packs.html#grayard" },
        { label: "Virtus", href: "packs.html#virtus" },
      ],
    },
    {
      label: "Contact",
      href: "#",
      key: "contact",
      children: [{ label: "Coming soon", href: "#", inert: true }],
    },
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

    root.innerHTML =
      '<header class="wc-nav">' +
      '<div class="wc-nav-inner">' +
      '<a class="wc-logo" href="index.html"><span class="wc-logo-mark" aria-hidden="true">🐾</span>Wolf Club</a>' +
      '<nav aria-label="Primary"><ul class="wc-menu">' + itemsHtml + "</ul></nav>" +
      '<div class="wc-nav-tools">' +
      '<div class="wc-search" role="search">' +
      '<span aria-hidden="true">🔍</span>' +
      '<input type="search" placeholder="Search…" aria-label="Search Wolf Club" />' +
      "</div>" +
      '<button class="wc-hamburger" type="button" aria-label="Toggle menu" aria-expanded="false">' +
      "<span></span><span></span><span></span></button>" +
      "</div></div></header>";
  }

  function wireInteractions(nav) {
    var hamburger = nav.querySelector(".wc-hamburger");
    var items = Array.prototype.slice.call(nav.querySelectorAll(".wc-menu-item"));

    function isMobile() {
      return window.matchMedia("(max-width: 880px)").matches;
    }

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

      item.addEventListener("mouseenter", function () {
        if (!isMobile()) {
          closeAllDropdowns(item);
          item.classList.add("is-open");
        }
      });
      item.addEventListener("mouseleave", function () {
        if (!isMobile()) item.classList.remove("is-open");
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

  function init() {
    var root = document.getElementById("wc-nav-root");
    if (!root) return;
    render(root);
    wireInteractions(root.querySelector(".wc-nav"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
