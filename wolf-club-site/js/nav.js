// Wolf Club — shared nav behavior (hamburger toggle + dropdowns).
// Desktop: dropdowns open on hover or keyboard focus.
// Mobile (<=880px, see styles.css): the whole menu collapses behind the
// hamburger button, and each item's dropdown becomes a tap-to-expand
// accordion instead of a hover flyout.
(function () {
  var nav = document.querySelector(".wc-nav");
  if (!nav) return;

  var hamburger = nav.querySelector(".wc-hamburger");
  var menu = nav.querySelector(".wc-menu");
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
    if (!dropdown) return;

    function toggle(e) {
      e.preventDefault();
      var willOpen = !item.classList.contains("is-open");
      closeAllDropdowns(item);
      item.classList.toggle("is-open", willOpen);
    }

    // Tap/click always toggles (covers mobile accordion + desktop click)
    link.addEventListener("click", toggle);

    // Desktop convenience: hover opens/closes without needing a click
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

  // Close dropdowns / mobile menu when clicking outside the nav
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) closeMenu();
  });

  // Escape key closes everything
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  // Reset stray open state when crossing the mobile/desktop breakpoint
  window.addEventListener("resize", function () {
    closeAllDropdowns();
  });
})();
