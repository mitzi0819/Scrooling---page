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
    const room = slide.querySelector("img.room");
    const suspect = slide.querySelector("img.suspect");
    if (!room || !suspect) return;

    gsap.set(suspect, { xPercent: 120, autoAlpha: 0 });

    room.addEventListener("click", () => {
      const isIn = slide.classList.contains("suspect-in");

      if (isIn) {
        gsap.to(suspect, {
          xPercent: 120,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.inOut"
        });
        slide.classList.remove("suspect-in");
      } else {
        gsap.to(suspect, {
          xPercent: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out"
        });
        slide.classList.add("suspect-in");
      }
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

});
