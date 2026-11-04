/* Felles hjelpere for Gløds eksempelsider. Ingen biblioteker. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var kr = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

  var Eks = {
    /** true når brukeren har bedt om mindre bevegelse */
    get rolig() { return reduced.matches; },

    /** 1234 -> "1 234 kr" */
    kr: function (n) { return kr.format(Math.round(n)) + " kr"; },

    /** Innglidning: elementer med data-r får klassen .inn når de vises.
        Barn av [data-r-gruppe] får små forsinkelser etter hverandre. */
    reveal: function () {
      document.querySelectorAll("[data-r-gruppe]").forEach(function (g) {
        var i = 0;
        g.querySelectorAll("[data-r]").forEach(function (el) { el.style.setProperty("--i", i++); });
      });
      var els = document.querySelectorAll("[data-r]");
      if (reduced.matches || !("IntersectionObserver" in window)) {
        els.forEach(function (el) { el.classList.add("inn"); });
        return;
      }
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("inn"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.1 });
      els.forEach(function (el) { io.observe(el); });
    },

    /** Mobilmeny: knapp med data-meny-knapp styrer elementet i aria-controls. */
    meny: function () {
      var btn = document.querySelector("[data-meny-knapp]");
      if (!btn) return;
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var sett = function (open) {
        btn.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("meny-apen", open);
      };
      btn.addEventListener("click", function () { sett(btn.getAttribute("aria-expanded") !== "true"); });
      if (panel) panel.addEventListener("click", function (e) { if (e.target.closest("a")) sett(false); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { sett(false); btn.focus(); }
      });
    },

    /** Viser en vennlig bekreftelse. Ingenting sendes noe sted.
        opts: { tittel, tekst, linjer: [[navn, verdi], ...], merk } */
    bekreft: function (opts) {
      var d = document.getElementById("eks-dialog");
      if (!d) {
        d = document.createElement("dialog");
        d.id = "eks-dialog";
        d.className = "eks-dialog";
        d.setAttribute("aria-labelledby", "eks-dialog-tittel");
        d.innerHTML =
          '<div class="eks-dialog__innhold">' +
          '<span class="eks-dialog__ikon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>' +
          '<h2 id="eks-dialog-tittel"></h2><p class="eks-dialog__tekst"></p>' +
          '<ul class="eks-dialog__liste" hidden></ul>' +
          '<p class="eks-dialog__merk"><b>EKSEMPEL</b><span></span></p>' +
          '<button type="button" class="eks-dialog__lukk">Ok, skjønner</button></div>';
        document.body.appendChild(d);
        d.querySelector(".eks-dialog__lukk").addEventListener("click", function () { d.close(); });
        d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
      }
      d.querySelector("h2").textContent = opts.tittel || "Takk!";
      d.querySelector(".eks-dialog__tekst").textContent = opts.tekst || "";
      var liste = d.querySelector(".eks-dialog__liste");
      liste.innerHTML = "";
      (opts.linjer || []).forEach(function (l) {
        var li = document.createElement("li");
        var a = document.createElement("span"); a.textContent = l[0];
        var b = document.createElement("span"); b.textContent = l[1];
        li.appendChild(a); li.appendChild(b); liste.appendChild(li);
      });
      liste.hidden = !(opts.linjer && opts.linjer.length);
      d.querySelector(".eks-dialog__merk span").textContent =
        opts.merk || "Dette er en eksempelside for et fiktivt firma. Ingenting er sendt eller bestilt.";
      if (typeof d.showModal === "function") {
        if (!d.open) d.showModal();
      } else {
        window.alert((opts.tittel || "") + "\n\n" + (opts.merk || "Dette er bare et eksempel. Ingenting er sendt."));
      }
    },

    /** Knapper med data-demo="tekst" viser en forklaring i stedet for å ringe/åpne kart. */
    demoKnapper: function () {
      document.querySelectorAll("[data-demo]").forEach(function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          Eks.bekreft({ tittel: el.getAttribute("data-demo-tittel") || "Her skjer det noe på en ekte side", tekst: el.getAttribute("data-demo"), merk: "Dette er en eksempelside. Nummeret og adressen er oppdiktet." });
        });
      });
    },

    /** Skjema med data-eks-skjema: sjekker påkrevde felt og viser bekreftelse. */
    skjema: function (form, lagLinjer, tittel, tekst) {
      form.setAttribute("novalidate", "");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var forste = null;
        form.querySelectorAll("[required]").forEach(function (f) {
          var tom = f.type === "checkbox" ? !f.checked : !f.value.trim();
          var feil = tom || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim()));
          f.setAttribute("aria-invalid", String(feil));
          var msg = document.getElementById(f.id + "-feil");
          if (msg) msg.textContent = feil ? (f.getAttribute("data-feil") || "Fyll ut dette feltet.") : "";
          if (feil && !forste) forste = f;
        });
        if (forste) { forste.focus(); return; }
        Eks.bekreft({ tittel: tittel, tekst: tekst, linjer: lagLinjer ? lagLinjer(new FormData(form)) : [] });
        form.reset();
      });
      form.querySelectorAll("[required]").forEach(function (f) {
        f.addEventListener("input", function () {
          if (f.getAttribute("aria-invalid") === "true") {
            var ok = f.type === "checkbox" ? f.checked : !!f.value.trim();
            if (ok) { f.setAttribute("aria-invalid", "false"); var m = document.getElementById(f.id + "-feil"); if (m) m.textContent = ""; }
          }
        });
      });
    },

    /** Kjør de vanlige tingene på en gang. */
    start: function () {
      Eks.reveal();
      Eks.meny();
      Eks.demoKnapper();
      var aar = document.querySelectorAll("[data-aar]");
      aar.forEach(function (el) { el.textContent = new Date().getFullYear(); });
    }
  };

  window.Eks = Eks;
})();
