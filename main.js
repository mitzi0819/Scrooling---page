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
    // Horizontal Scroll im 2. Stock
    // ----------------------------------------
    const hScrollAnim = gsap.to(".h-scroll", {
        x: "-66.666%", // 3 Panels (100% / 3 * 2) = 66.666% Verschiebung
        ease: "none",
        paused: true
    });

    let hProgress = 0;
    const floor2 = document.querySelector(".floor2");

    function handleHorizontalScroll(e) {
        // Verhindert das Standard-Scrollen der Seite, wenn wir das Panel verschieben
        e.preventDefault();
        // Wir verwenden deltaY, da vertikales Scrollen auf dem Mausrad 
        // den horizontalen Effekt steuern soll.
        const delta = e.deltaY * 0.0015;

        hProgress += delta;
        hProgress = Math.max(0, Math.min(1, hProgress)); // Werte zwischen 0 und 1

        hScrollAnim.progress(hProgress);
    }

    // Erstellt einen ScrollTrigger, der den Event-Listener nur aktiviert/deaktiviert,
    // wenn das 2. Stockwerk in Sicht kommt.
    if (floor2) {
        ScrollTrigger.create({
            trigger: floor2,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
                if (self.isActive) {
                    // Aktiviert den Listener, wenn das Stockwerk sichtbar ist
                    floor2.addEventListener("wheel", handleHorizontalScroll, {
                        passive: false
                    });
                } else {
                    // Deaktiviert den Listener, wenn das Stockwerk nicht mehr sichtbar ist
                    floor2.removeEventListener("wheel", handleHorizontalScroll);
                }
            }
        });
    }
});