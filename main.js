gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 1️⃣ Warten, bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {

    // Sicherstellen, dass die Seite ganz oben beginnt, bevor GSAP die Kontrolle übernimmt.
    window.scrollTo(0, 0);


    // ----------------------------------------
    // Fade-in Animation für alle Stockwerke
    // ----------------------------------------
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
                    start: "top 80%", // Startet, wenn 80% des Viewports erreicht sind
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // ----------------------------------------
  // Taschenlampen-Effekt (nur in .flashlight-scene)
  // ----------------------------------------
  const RADIUS = 160;     // Größe des Lichtkreises
  const SOFT_EDGE = 70;   // Weicher Rand

  document.querySelectorAll(".flashlight-scene").forEach(scene => {
    const yellow = scene.querySelector(".flashlight-yellow");
    if (!yellow) return;

    function setMask(x, y, radius, soft) {
      // Mask: schwarz = sichtbar, transparent = unsichtbar
      const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px,
        rgba(0,0,0,1) 0px,
        rgba(0,0,0,1) ${Math.max(0, radius - soft)}px,
        rgba(0,0,0,0) ${radius}px
      )`;

      yellow.style.webkitMaskImage = mask;
      yellow.style.maskImage = mask;
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
      setMask(0, 0, 0, 0); // aus
    });

    // Touch support
    scene.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      const { x, y } = relPos(t.clientX, t.clientY);
      setMask(x, y, RADIUS, SOFT_EDGE);
      e.preventDefault();
    }, { passive: false });

    scene.addEventListener("touchend", () => {
      setMask(0, 0, 0, 0);
    });
  });
});


var $headline = $('.headline'),
    $inner = $('.inner'),
    $nav = $('nav'),
    navHeight = 75;

$(window).scroll(function() {
  var scrollTop = $(this).scrollTop(),
      headlineHeight = $headline.outerHeight() - navHeight,
      navOffset = $nav.offset().top;

  $headline.css({
    'opacity': (1 - scrollTop / headlineHeight)
  });
  $inner.children().css({
    'transform': 'translateY('+ scrollTop * 0.4 +'px)'
  });
  if (navOffset > headlineHeight) {
    $nav.addClass('scrolled');
  } else {
    $nav.removeClass('scrolled');
  }
});


  