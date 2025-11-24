gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ------------------------------
// 1️⃣ Intro automatisch ausblenden
// ------------------------------
gsap.to(".intro", {
  opacity: 0,
  duration: 1.5,
  delay: 3,
  onComplete: () => {
    gsap.to(window, { scrollTo: ".floor1", duration: 1 });
  }
});

// ----------------------------------------
// 2️⃣ Normale Fade-in Animation für Etagen
// ----------------------------------------
gsap.utils.toArray(".floor").forEach(floor => {
  gsap.fromTo(
    floor,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: floor,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    }
  );
});

// --------------------------------------------------
// 3️⃣ Horizontal Scroll NUR im 2. Stock (floor2)
// --------------------------------------------------

let hScroll = gsap.to(".h-scroll", {
  x: "-50%",
  ease: "none",
  paused: true
});

let progress = 0;
const innerWrapper = document.querySelector(".inner-wrapper");

innerWrapper.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();

    // 🔥 Neu: horizontales scrollen über deltaX
    let delta = (e.deltaY + e.deltaX) * 0.001;

    progress += delta;
    progress = Math.min(Math.max(progress, 0), 1);

    hScroll.progress(progress);
  },
  { passive: false }
);
