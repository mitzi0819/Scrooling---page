// ================================
// GSAP Plugins (nur die, die du nutzt)
// ================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ================================
// Auto-Scroll (nach 3 Sekunden) zu Floor 1
// ================================
window.scrollTo(0, 0);

window.addEventListener("load", () => {
  setTimeout(() => {
    const target = document.querySelector("#floor1Id");
    if (!target) return;

    gsap.to(window, {
      duration: 1.4,
      ease: "power2.inOut",
      scrollTo: { y: target, offsetY: 0, autoKill: false },
      onComplete: () => ScrollTrigger.refresh()
    });
  }, 3000);
});

// ================================
// DOM Ready
// ================================
document.addEventListener("DOMContentLoaded", () => {
  // Fade-in je Floor beim Scrollen
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

  // Button: scrollt zu Floor 2 (optional: mit GSAP statt scrollIntoView)
  const btn = document.getElementById("scrollBtn");
  const floor2 = document.getElementById("floor2Id");

  if (btn && floor2) {
    btn.addEventListener("click", () => {
      gsap.to(window, {
        duration: 1,
        ease: "power2.inOut",
        scrollTo: { y: floor2, offsetY: 0, autoKill: true }
      });
    });
  }

  // ================================
  // Taschenlampen-Effekt
  // ================================
  const RADIUS = 160;
  const SOFT_EDGE = 70;

  document.querySelectorAll(".flashlight-scene").forEach((scene) => {
    const yellow = scene.querySelector(".flashlight-yellow");
    if (!yellow) return;

    const setMask = (x, y) => {
      const inner = Math.max(0, RADIUS - SOFT_EDGE);

      const mask = `radial-gradient(circle ${RADIUS}px at ${x}px ${y}px,
        rgba(0,0,0,1) 0px,
        rgba(0,0,0,1) ${inner}px,
        rgba(0,0,0,0) ${RADIUS}px
      )`;

      yellow.style.webkitMaskImage = mask;
      yellow.style.maskImage = mask;
      yellow.style.webkitMaskRepeat = "no-repeat";
      yellow.style.maskRepeat = "no-repeat";
      yellow.style.webkitMaskSize = "100% 100%";
      yellow.style.maskSize = "100% 100%";
    };

    const relPos = (e) => {
      const r = scene.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    // Maus bewegt -> Maske folgt
    scene.addEventListener("mousemove", (e) => {
      const { x, y } = relPos(e);
      setMask(x, y);
    });

    // Beim Rein: gleich an der Eintrittsposition anzeigen
    scene.addEventListener("mouseenter", (e) => {
      const { x, y } = relPos(e);
      setMask(x, y);
    });

    // Beim Raus: Effekt aus
    scene.addEventListener("mouseleave", () => {
      // "aus" setzen (Radius 0)
      const maskOff = `radial-gradient(circle 0px at 0px 0px,
        rgba(0,0,0,0) 0px, rgba(0,0,0,0) 100%
      )`;
      yellow.style.webkitMaskImage = maskOff;
      yellow.style.maskImage = maskOff;
    });
  });
});

document.getElementById("scrollImage").addEventListener("click", function () {
  document.getElementById("targetDiv").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

document.getElementById("reloadImage").addEventListener("click", () => {
  location.reload(true);
});

document.getElementById("reloadImage2").addEventListener("click", () => {
  location.reload(true);
});

document.getElementById("scrollBtn2").addEventListener("click", () => {
  document.getElementById("floor2Id").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("scrollBtn3").addEventListener("click", () => {
  document.getElementById("floor3Id").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("scrollBtn4").addEventListener("click", () => {
  document.getElementById("floor4Id").scrollIntoView({
    behavior: "smooth"
  });
});


 const infoBox = document.getElementById("infoBox");
  const section = document.querySelector(".floor");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          infoBox.classList.add("active");
          observer.unobserve(entry.target); // nur einmal
        }
      });
    },
    {
      threshold: 0.4
    }
  );

  observer.observe(section);

  // Klick → raus + danach komplett weg
  infoBox.addEventListener("click", () => {
    infoBox.classList.remove("active");
    infoBox.classList.add("exit");

    infoBox.addEventListener("transitionend", () => {
      infoBox.style.display = "none";
    }, { once: true });
  });

