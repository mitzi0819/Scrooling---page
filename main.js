gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // 1️⃣ Intro: nach 3 Sekunden ausblenden und zur ersten Etage scrollen
  gsap.to(".intro", {
    opacity: 0,
    duration: 1.5,
    delay: 3,
    onComplete: () => {
      gsap.to(window, { scrollTo: ".floor1", duration: 1 });
    }
  });

  // 2️⃣ Jede Etage sanft einblenden, wenn sie in den Viewport kommt
  gsap.utils.toArray(".floor").forEach(floor => {
    gsap.fromTo(floor, 
      { opacity: 0, y: 50 }, 
      {
        opacity: 1, 
        y: 0, 
        duration: 1,
        scrollTrigger: {
          trigger: floor,
          start: "top 80%",   // Beginn der Animation
          toggleActions: "play none none none"
        }
      }
    );
  });
