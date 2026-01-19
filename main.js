gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

// Auto-Scroll zu Floor1 (min. 3 Sekunden)
const pageStart = performance.now();
window.scrollTo(0, 0);

window.addEventListener("load", () => {
  const elapsed = performance.now() - pageStart;
  const remaining = Math.max(0, 3000 - elapsed);

  setTimeout(() => {
    const target = document.querySelector("#floor1Id");
    if (!target) return;

    gsap.to(window, {
      duration: 1.4,
      ease: "power2.inOut",
      scrollTo: { y: target, offsetY: 0, autoKill: false },
      onComplete: () => ScrollTrigger.refresh()
    });
  }, remaining);
});

document.addEventListener("DOMContentLoaded", () => {

  // Fade in Floors
  gsap.utils.toArray(".floor").forEach((floor) => {
    gsap.fromTo(
      floor,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: floor,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  // Button Floor1 -> Floor2
  const btn = document.getElementById("scrollBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      document.getElementById("floor2Id")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ===== Floor2: Klick auf Raum -> Person rein/raus =====
 const slides = document.querySelectorAll("#floor2Id #slider .slide");

slides.forEach((slide) => {
  const room = slide.querySelector(".room");
  const suspect = slide.querySelector(".suspect");
  if (!room || !suspect) return;

  gsap.set(suspect, { xPercent: 120, autoAlpha: 0 });

  room.addEventListener("click", () => {
    const isIn = slide.classList.contains("suspect-in");

    gsap.to(suspect, {
      xPercent: isIn ? 120 : 0,
      autoAlpha: isIn ? 0 : 1,
      duration: isIn ? 0.6 : 0.8,
      ease: isIn ? "power2.inOut" : "power3.out"
    });

    slide.classList.toggle("suspect-in");
  });
});

  // Optional: Beim Slide-Wechsel Person wieder raus
  document.querySelectorAll('#floor2Id #slider input[name="slider"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      slides.forEach((slide) => {
        slide.classList.remove("suspect-in");
        const suspect = slide.querySelector("img.suspect");
        if (suspect) gsap.set(suspect, { xPercent: 120, autoAlpha: 0 });
      });
    });
  });

  /// ===== Floor4: Infinite Horizontal Scroll (ohne Buttons) =====
(() => {
  const floor4 = document.querySelector("#floor4Id");
  if (!floor4) return;

  const viewport = floor4.querySelector(".carousel-viewport");
  const track = floor4.querySelector(".carousel-track");
  if (!viewport || !track) return;

  const VISIBLE = 3;

  // Original Cards
  const originals = Array.from(track.children);
  if (originals.length <= VISIBLE) return;

  // Klone: vorne letzte 3, hinten erste 3 (für nahtlosen Loop)
  const headClones = originals.slice(0, VISIBLE).map((el) => el.cloneNode(true));
  const tailClones = originals.slice(-VISIBLE).map((el) => el.cloneNode(true));

  tailClones.forEach((c) => track.insertBefore(c, track.firstChild));
  headClones.forEach((c) => track.appendChild(c));

  const getStep = () => {
    const card = track.querySelector(".card");
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || "0") || 0;
    return card.getBoundingClientRect().width + gap;
  };

  // Start: so scrollen, dass wir bei den Originalen beginnen (nach den vorderen Klonen)
  const jumpToOriginalStart = () => {
    const step = getStep();
    if (!step) return;
    viewport.scrollLeft = step * VISIBLE;
  };

  // nach Layout (damit Breite stimmt)
  requestAnimationFrame(() => {
    jumpToOriginalStart();
  });

  // Infinite-Logik: wenn du zu weit links/rechts scrollst, springt es unmerklich zurück
  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const step = getStep();
      if (!step) { ticking = false; return; }

      const totalOriginals = originals.length;
      const leftLimit = step * (VISIBLE - 0.5); // etwas Puffer
      const rightLimit = step * (VISIBLE + totalOriginals + 0.5);

      // zu weit links -> ans Ende der Originale springen
      if (viewport.scrollLeft < leftLimit) {
        viewport.scrollLeft += step * totalOriginals;
      }

      // zu weit rechts -> an den Anfang der Originale springen
      if (viewport.scrollLeft > rightLimit) {
        viewport.scrollLeft -= step * totalOriginals;
      }

      ticking = false;
    });
  };

  viewport.addEventListener("scroll", onScroll, { passive: true });

  // Bei Resize neu ausrichten
  window.addEventListener("resize", () => {
    jumpToOriginalStart();
  });
})();

});
