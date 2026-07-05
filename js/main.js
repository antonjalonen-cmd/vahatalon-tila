(function () {
  "use strict";

  var STORAGE_KEY = "vahatalon-lang";

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-fi]").forEach(function (el) {
      var val = el.getAttribute("data-" + lang);
      if (val !== null) el.innerHTML = val;
    });
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang ? "true" : "false");
    });
    var title = document.body.getAttribute("data-title-" + lang) || document.body.getAttribute("data-title-fi");
    if (title) {
      document.title = title;
    }
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  function initLang() {
    var saved = "fi";
    try { saved = localStorage.getItem(STORAGE_KEY) || "fi"; } catch (e) {}
    applyLang(saved);
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { applyLang(btn.dataset.lang); });
    });
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    var lightbox = document.querySelector(".lightbox");
    if (!triggers.length || !lightbox) return;

    var imgEl = lightbox.querySelector("img");
    var captionEl = lightbox.querySelector("figcaption");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-prev");
    var nextBtn = lightbox.querySelector(".lightbox-next");
    var currentIndex = 0;
    var lastFocused = null;

    function currentLang() { return document.documentElement.lang || "fi"; }

    function show(index) {
      currentIndex = (index + triggers.length) % triggers.length;
      var trigger = triggers[currentIndex];
      var full = trigger.getAttribute("data-full") || trigger.querySelector("img").src;
      var caption = trigger.getAttribute("data-caption-" + currentLang()) || trigger.getAttribute("data-caption-fi") || "";
      imgEl.src = full;
      imgEl.alt = caption;
      captionEl.textContent = caption;
    }

    function open(index) {
      lastFocused = document.activeElement;
      show(index);
      lightbox.classList.add("open");
      closeBtn.focus();
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function () { open(index); });
    });
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", function () { show(currentIndex - 1); });
    nextBtn.addEventListener("click", function () { show(currentIndex + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(currentIndex + 1);
      if (e.key === "ArrowLeft") show(currentIndex - 1);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLang();
    initNav();
    initHeaderShadow();
    initReveal();
    initLightbox();
  });
})();
