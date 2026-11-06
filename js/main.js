/* Glød – vanilla JavaScript. Ingen biblioteker, ingen sporing. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------- Årstall i bunnen ---------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Topplinje: uskarp bakgrunn ved scrolling ---------- */
  var topbar = document.querySelector(".topbar");
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobilmeny ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("hovedmeny");
  if (toggle && nav && topbar) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      topbar.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!topbar.contains(e.target)) setOpen(false);
    });
  }

  /* ---------- Innglidning ved scrolling ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    var i = 0;
    Array.prototype.forEach.call(group.children, function (child) {
      if (child.hasAttribute("data-reveal")) child.style.setProperty("--i", String(i++));
    });
  });

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Aktiv lenke i menyen ---------- */
  var navLinks = document.querySelectorAll(".nav__list a[href^='#']");
  if (navLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        } else if (link.getAttribute("aria-current")) {
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
  }

  /* ---------- Hero-glød som følger musen svakt (kun desktop) ---------- */
  var glow = document.querySelector("[data-parallax]");
  var hero = document.querySelector(".hero");
  if (glow && hero && finePointer.matches && !reduceMotion.matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, heroVisible = true;
    var tick = function () {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      glow.style.transform = "translate3d(" + cx.toFixed(2) + "px," + cy.toFixed(2) + "px,0)";
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    };
    window.addEventListener("pointermove", function (e) {
      if (!heroVisible) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 40;
      ty = (e.clientY / window.innerHeight - 0.5) * 28;
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }).observe(hero);
    }
  }

  /* ---------- Lett tilt på pakkekortene (kun desktop) ---------- */
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var inner = card.querySelector(".pkg__inner");
      var frame = null;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          card.style.setProperty("--ry", ((px - 0.5) * 6).toFixed(2) + "deg");
          card.style.setProperty("--rx", ((0.5 - py) * 5).toFixed(2) + "deg");
          if (inner) {
            inner.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
            inner.style.setProperty("--my", (py * 100).toFixed(1) + "%");
          }
        });
      });
      card.addEventListener("pointerleave", function () {
        if (frame) cancelAnimationFrame(frame);
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- Galleri: forrige / neste ---------- */
  var gallery = document.getElementById("galleri");
  if (gallery) {
    var prev = document.querySelector("[data-gallery='prev']");
    var next = document.querySelector("[data-gallery='next']");
    var step = function () {
      var item = gallery.querySelector(".example");
      var gap = parseFloat(getComputedStyle(gallery.querySelector(".gallery__track")).columnGap) || 24;
      return item ? item.getBoundingClientRect().width + gap : gallery.clientWidth * 0.8;
    };
    var update = function () {
      var max = gallery.scrollWidth - gallery.clientWidth - 2;
      if (prev) prev.disabled = gallery.scrollLeft <= 2;
      if (next) next.disabled = gallery.scrollLeft >= max;
    };
    var behavior = reduceMotion.matches ? "auto" : "smooth";
    if (prev) prev.addEventListener("click", function () { gallery.scrollBy({ left: -step(), behavior: behavior }); });
    if (next) next.addEventListener("click", function () { gallery.scrollBy({ left: step(), behavior: behavior }); });
    gallery.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Levende forhåndsvisning av eksempelsidene ---------- */
  // Hver iframe viser hele eksempelsiden, skalert ned til kortets bredde.
  // På smale skjermer vises mobilversjonen av siden (390 px bred).
  var previews = document.querySelectorAll(".preview");
  var sizePreviews = function () {
    previews.forEach(function (pv) {
      var w = pv.clientWidth;
      if (!w) return;
      var mobil = w < 420;
      var vw = mobil ? 390 : 1280;
      var s = w / vw;
      pv.classList.toggle("preview--mobil", mobil);
      var h = pv.clientHeight / s;
      pv.style.setProperty("--pv-w", vw + "px");
      pv.style.setProperty("--pv-h", Math.ceil(h) + "px");
      pv.style.setProperty("--pv-s", s.toFixed(4));
    });
  };
  if (previews.length) {
    sizePreviews();
    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () { sizePreviews(); });
      previews.forEach(function (pv) { ro.observe(pv); });
    } else {
      window.addEventListener("resize", sizePreviews);
    }
  }

  /* ---------- «Åpne som mobil»: eksempelsiden i en telefonramme ---------- */
  var phone = document.getElementById("mobilvisning");
  if (phone && typeof phone.showModal === "function") {
    var phoneFrame = document.getElementById("mobilvisning-ramme");
    var phoneDevice = phone.querySelector(".phone-modal__device");
    var phoneStage = phone.querySelector(".phone-modal__stage");
    var phoneTitle = document.getElementById("mobilvisning-tittel");
    var phoneLink = document.getElementById("mobilvisning-lenke");
    var lastTrigger = null;
    var fitPhone = function () {
      var availH = phoneStage.clientHeight - 32;
      var availW = phoneStage.clientWidth - 32;
      var s = Math.min(1, (availH - 24) / 834, (availW - 24) / 390);
      phoneDevice.style.setProperty("--ph-s", Math.max(0.4, s).toFixed(4));
    };
    document.querySelectorAll("[data-mobil]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        lastTrigger = btn;
        var url = btn.getAttribute("data-mobil");
        phoneTitle.textContent = btn.getAttribute("data-navn") + " på mobil";
        phoneLink.href = url;
        phoneFrame.src = url;
        phone.showModal();
        fitPhone();
        document.getElementById("mobilvisning-lukk").focus();
      });
    });
    document.getElementById("mobilvisning-lukk").addEventListener("click", function () { phone.close(); });
    phone.addEventListener("click", function (e) { if (e.target === phone || e.target === phoneStage) phone.close(); });
    phone.addEventListener("close", function () {
      phoneFrame.src = "about:blank";
      if (lastTrigger) lastTrigger.focus();
    });
    window.addEventListener("resize", function () { if (phone.open) fitPhone(); });
  } else {
    // Eldre nettlesere uten <dialog>: åpne siden i ny fane i stedet
    document.querySelectorAll("[data-mobil]").forEach(function (btn) {
      btn.addEventListener("click", function () { window.open(btn.getAttribute("data-mobil"), "_blank", "noopener"); });
    });
  }

  /* ---------- Pakkeknapper velger pakke i skjemaet ---------- */
  var pakkeSelect = document.getElementById("f-pakke");
  document.querySelectorAll("[data-pakke]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (pakkeSelect) pakkeSelect.value = btn.getAttribute("data-pakke");
    });
  });

  /* ---------- Kontaktskjema ---------- */
  var form = document.getElementById("kontaktskjema");
  if (!form) return;

  var success = document.getElementById("skjema-takk");
  var successText = document.getElementById("skjema-takk-tekst");
  var again = document.getElementById("skjema-ny");
  var submitBtn = form.querySelector(".form__submit");

  var messages = {
    navn: "Skriv inn navnet ditt.",
    firmanavn: "Skriv inn navnet på firmaet. Har det ikke navn ennå, skriv «Ikke bestemt».",
    epost: "Skriv inn e-postadressen din.",
    epostFormat: "Det ser ikke ut som en gyldig e-postadresse.",
    telefon: "Telefonnummeret ser ikke riktig ut.",
    melding: "Skriv noen ord om hva du trenger.",
    samtykke: "Du må krysse av her før vi kan kontakte deg."
  };

  var showError = function (input, text) {
    var err = document.getElementById(input.getAttribute("aria-describedby"));
    if (text) {
      input.setAttribute("aria-invalid", "true");
      if (err) err.textContent = text;
    } else {
      input.removeAttribute("aria-invalid");
      if (err) err.textContent = "";
    }
  };

  var validateField = function (input) {
    var v = input.type === "checkbox" ? input.checked : input.value.trim();
    var name = input.name;
    if (name === "telefon") {
      var ok = !v || /^[+0-9 ()-]{5,20}$/.test(v);
      showError(input, ok ? "" : messages.telefon);
      return ok;
    }
    if (input.required && !v) {
      showError(input, messages[name] || "Dette feltet må fylles ut.");
      return false;
    }
    if (name === "epost" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      showError(input, messages.epostFormat);
      return false;
    }
    showError(input, "");
    return true;
  };

  var fields = form.querySelectorAll("input[aria-describedby], textarea[aria-describedby]");
  fields.forEach(function (input) {
    var evt = input.type === "checkbox" ? "change" : "blur";
    input.addEventListener(evt, function () {
      if (input.type !== "checkbox" && !input.value.trim() && !input.hasAttribute("aria-invalid")) return;
      validateField(input);
    });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") validateField(input);
    });
  });

  var showSuccess = function (viaMail) {
    form.hidden = true;
    if (successText) {
      successText.textContent = viaMail
        ? "Vi svarer på henvendelser innen 24 timer på hverdager."
        : "Vi svarer på henvendelser innen 24 timer på hverdager.";
    }
    success.hidden = false;
    success.focus();
  };

  var isConfigured = function (value) {
    return value && value.indexOf("[") === -1 && /^https?:\/\//.test(value);
  };

  var openMailto = function (data) {
    var to = form.getAttribute("data-epost") || "";
    var subject = "Henvendelse fra " + data.get("navn") + " (" + data.get("firmanavn") + ")";
    var body = [
      "Navn: " + data.get("navn"),
      "Firma: " + data.get("firmanavn"),
      "E-post: " + data.get("epost"),
      "Telefon: " + (data.get("telefon") || "–"),
      "Pakke: " + data.get("pakke"),
      "Har nettside i dag: " + (data.get("har_nettside") || "–"),
      "Type nettside: " + (data.get("type_nettside") || "–"),
      "Ønsket oppstart: " + (data.get("oppstart") || "–"),
      "",
      data.get("melding"),
      "",
      "Samtykke til å bli kontaktet: ja"
    ].join("\n");
    window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstInvalid = null;
    fields.forEach(function (input) {
      if (!validateField(input) && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    if (data.get("nettsted")) {        // spam-felle fylt ut: lat som alt gikk fint
      showSuccess(false);
      return;
    }

    var action = form.getAttribute("action");
    if (!isConfigured(action) || !window.fetch) {
      var status = document.getElementById("skjema-status");
      if (status) status.textContent = "Skjemaet er ikke aktivert ennå. Ring oss på +47 466 26 880.";
      return;
    }

    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.textContent = "Sender …";
    fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("Status " + res.status);
        showSuccess(false);
      })
      .catch(function () {
        var status = document.getElementById("skjema-status");
        if (status) status.textContent = "Meldingen ble ikke sendt. Prøv igjen senere eller ring oss på +47 466 26 880.";
      })
      .then(function () {
        submitBtn.removeAttribute("aria-busy");
        submitBtn.textContent = "Send forespørsel";
      });
  });

  if (again) {
    again.addEventListener("click", function () {
      form.reset();
      success.hidden = true;
      form.hidden = false;
      form.querySelector("input").focus();
    });
  }
})();
