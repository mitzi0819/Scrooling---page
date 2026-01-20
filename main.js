// ================================
// GSAP Plugins
// ================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable);

// ================================
// Auto-Scroll (min. 3 Sekunden nach Start) zu Floor 1
// ================================
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

// ================================
// DOM Ready
// ================================
document.addEventListener("DOMContentLoaded", () => {

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

  const btn = document.getElementById("scrollBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      document.getElementById("floor2Id")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  const RADIUS = 160;
  const SOFT_EDGE = 70;

  document.querySelectorAll(".flashlight-scene").forEach((scene) => {
    const yellow = scene.querySelector(".flashlight-yellow");
    if (!yellow) return;

    function setMask(x, y, radius, soft) {
      const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px,
        rgba(0,0,0,1) 0px,
        rgba(0,0,0,1) ${Math.max(0, radius - soft)}px,
        rgba(0,0,0,0) ${radius}px
      )`;

      yellow.style.webkitMaskImage = mask;
      yellow.style.maskImage = mask;
      yellow.style.webkitMaskRepeat = "no-repeat";
      yellow.style.maskRepeat = "no-repeat";
      yellow.style.webkitMaskSize = "100% 100%";
      yellow.style.maskSize = "100% 100%";
    }

    function relPos(clientX, clientY) {
      const r = scene.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    }

    scene.addEventListener("mousemove", (e) => {
      const { x, y } = relPos(e.clientX, e.clientY);
      setMask(x, y, RADIUS, SOFT_EDGE);
    });

    scene.addEventListener("mouseenter", (e) => {
      const { x, y } = relPos(e.clientX, e.clientY);
      setMask(x, y, RADIUS, SOFT_EDGE);
    });

    scene.addEventListener("mouseleave", () => {
      setMask(0, 0, 0, 0);
    });
  });

});
