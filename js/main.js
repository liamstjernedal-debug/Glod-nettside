/* Glød – vanilla JavaScript. Ingen biblioteker, ingen sporing. */
const SKJEMA_ENDEPUNKT = "https://api.web3forms.com/submit";
(function () {
  "use strict";

  var root = document.documentElement;

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
  root.classList.add("js");

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

  /* ---------- Glød: et mykt lys som følger pekeren (kun desktop) ----------
     Lyset flyttes med transform via CSS-variabler, én gang per bilde (rAF).
     På mobil og med redusert bevegelse står lyset stille. */
  if (finePointer.matches && !reduceMotion.matches) {
    document.querySelectorAll("[data-glod]").forEach(function (flate) {
      var lys = flate.querySelector(".glod");
      if (!lys) return;
      var mx = 0, my = 0, cx = null, cy = null, raf = null;
      var tick = function () {
        if (cx === null) { cx = mx; cy = my; }
        cx += (mx - cx) * 0.12;
        cy += (my - cy) * 0.12;
        lys.style.setProperty("--gx", cx.toFixed(1) + "px");
        lys.style.setProperty("--gy", cy.toFixed(1) + "px");
        raf = (Math.abs(mx - cx) > 0.5 || Math.abs(my - cy) > 0.5) ? requestAnimationFrame(tick) : null;
      };
      flate.addEventListener("pointermove", function (e) {
        var r = flate.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        if (!raf) raf = requestAnimationFrame(tick);
      }, { passive: true });
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

  // De ekte sidene lastes først når kortet er synlig, så forsiden ikke blir tung.
  // Skjermbildet ligger under som reserve og vises til siden er klar.
  var rammer = document.querySelectorAll(".preview__ramme");
  var spareData = navigator.connection && navigator.connection.saveData;
  // Bare på bredere skjermer: på mobil vises skjermbildet med mobilbilde, som gir et bedre inntrykk og sparer data.
  var bredSkjerm = window.matchMedia("(min-width: 700px)").matches;
  if (rammer.length && "IntersectionObserver" in window && !spareData && bredSkjerm) {
    var rammeObserver = new IntersectionObserver(function (poster) {
      poster.forEach(function (p) {
        if (!p.isIntersecting) return;
        rammeObserver.unobserve(p.target);
        var ramme = p.target.querySelector(".preview__ramme");
        if (!ramme) return;
        ramme.addEventListener("load", function () { ramme.classList.add("er-klar"); });
        ramme.src = ramme.getAttribute("data-src");
      });
    }, { threshold: 0.6 });
    rammer.forEach(function (r) { rammeObserver.observe(r.closest(".example") || r); });
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

  /* ---------- Kontaktskjema ---------- */
  var form = document.getElementById("kontaktskjema");
  if (!form) return;

  /* Ta med valgt tjeneste og pakke uten å endre det besøkende skriver. */
  var selectedService = new URLSearchParams(window.location.search).get("tjeneste") || "";
  var serviceField = document.getElementById("f-tjeneste");
  if (serviceField) serviceField.value = selectedService;
  document.querySelectorAll("[data-pakke]").forEach(function (link) {
    link.addEventListener("click", function () {
      var selected = link.getAttribute("data-pakke");
      form.querySelectorAll('input[name="pakke"]').forEach(function (input) {
        input.checked = input.value === selected;
      });
    });
  });

  var success = document.getElementById("skjema-takk");
  var successText = document.getElementById("skjema-takk-tekst");
  var again = document.getElementById("skjema-ny");
  var submitBtn = form.querySelector(".form__submit");

  var messages = {
    navn: "Skriv inn navnet ditt.",
    firmanavn: "Skriv inn navnet på firmaet. Har det ikke navn ennå, skriv «Ikke bestemt».",
    epost: "Skriv inn e-postadressen din.",
    epostFormat: "Det ser ikke ut som en gyldig e-postadresse.",
    melding: "Skriv noen ord om bedriften din."
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
      successText.textContent = "Vi svarer innen 1 virkedag.";
    }
    success.hidden = false;
    success.focus();
  };

  var isConfigured = function (value) {
    return value && value.indexOf("[") === -1 && /^https?:\/\//.test(value);
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

    if (!isConfigured(SKJEMA_ENDEPUNKT) || !window.fetch) {
      var status = document.getElementById("skjema-status");
      if (status) status.textContent = "Skjemaet er ikke koblet til ennå.";
      return;
    }

    var data = new FormData(form);
    if (data.get("nettsted")) {        // spam-felle fylt ut: lat som alt gikk fint
      showSuccess(false);
      return;
    }

    data.append("name", data.get("navn") || "");      // Web3Forms bruker name/email som avsender og «svar til»
    data.append("email", data.get("epost") || "");

    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.textContent = "Sender …";
    fetch(SKJEMA_ENDEPUNKT, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("Status " + res.status);
        return res.json();
      })
      .then(function (json) {
        if (!json || json.success !== true) throw new Error("Avvist");
        showSuccess(false);
      })
      .catch(function () {
        var status = document.getElementById("skjema-status");
        if (status) status.textContent = "Meldingen ble ikke sendt. Prøv igjen senere.";
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
