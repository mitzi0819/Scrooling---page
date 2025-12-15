gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 1️⃣ Warten, bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", () => {
    
    // Sicherstellen, dass die Seite ganz oben beginnt, bevor GSAP die Kontrolle übernimmt.
    window.scrollTo(0, 0);

    // ----------------------------------------
    // Timeline für Intro-Fade-Out → Automatisches Scrollen zum 1. Stock
    // ----------------------------------------
    gsap.timeline({
            // Stellt sicher, dass die Animation nur einmal abläuft
            once: true,
            // Hier legen wir den Startpunkt fest, FALLS die Timeline aus irgendeinem Grund
            // nicht automatisch starten sollte (was aber selten der Fall sein sollte)
            delay: 0.1 
        })
        .to(".intro", {
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power2.out",
            onComplete: () => {
                // Das Intro-Element *nach* dem Fade-Out aus dem Fluss nehmen
                const intro = document.querySelector(".intro");
                if (intro) intro.style.display = "none";
            }
        })
        .to(window, {
            // ⭐ Zwangsbefehl zum Scrollen zum .floor1 Element
            scrollTo: {
                y: ".floor1", // Scrollt zum ersten Element mit der Klasse .floor1
                offsetY: 0
            }, 
            duration: 1.0, 
            ease: "power2.inOut"
        }, "<0.1"); // Startet kurz nach dem Intro-Fade-Out

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