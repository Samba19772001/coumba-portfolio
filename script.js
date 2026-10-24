/* =========================================
   LADY COUMBA AGENCY
   Interactions et animations du portfolio
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    // 1. ÉCRAN DE CHARGEMENT
    const loader = document.getElementById("loader");

    const hideLoader = () => {
        if (loader) {
            loader.classList.add("loaded");
        }
    };

    // Laisser apparaître brièvement le monogramme LC.
    window.setTimeout(hideLoader, 500);

    // Sécurité : masquer le loader même si le délai précédent échoue.
    window.addEventListener("load", hideLoader, { once: true });


    // 2. MENU MOBILE
    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {
        const closeMenu = () => {
            navigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Ouvrir le menu");
        };

        const openMenu = () => {
            navigation.classList.add("open");
            menuToggle.setAttribute("aria-expanded", "true");
            menuToggle.setAttribute("aria-label", "Fermer le menu");
        };

        menuToggle.addEventListener("click", () => {
            const isOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Fermer le menu après avoir choisi une page.
        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Fermer le menu si l'utilisateur clique à l'extérieur.
        document.addEventListener("click", (event) => {
            const clickedInsideNavigation = navigation.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideNavigation && !clickedToggle) {
                closeMenu();
            }
        });

        // Fermer avec la touche Échap.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });

        // Réinitialiser le menu lorsque l'écran redevient large.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMenu();
            }
        });
    }


    // 3. ANNÉE AUTOMATIQUE DANS LE FOOTER
    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // 4. ANIMATIONS AU DÉFILEMENT
    const revealElements = document.querySelectorAll(
        [
            ".section-heading",
            ".intro-grid",
            ".services-header",
            ".service-card",
            ".projects-header",
            ".project-card",
            ".agency-cta-content",
            ".page-hero-inner",
            ".case",
            ".case-intro",
            ".assoc-card",
            ".attestation",
            ".facts-grid",
            ".contact-layout",
            ".footer"
        ].join(", ")
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("reveal");
        });

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }


    // 5. ANNÉE ET NAVIGATION : PAGE ACTIVE
    const currentPath = window.location.pathname;
    const navigationLinks = document.querySelectorAll(".navigation a");

    navigationLinks.forEach((link) => {
        const linkUrl = new URL(link.href, window.location.href);
        const linkPath = linkUrl.pathname;

        const isHomePage =
            linkPath === "/" ||
            linkPath.endsWith("/index.html");

        const isCurrentHomePage =
            currentPath === "/" ||
            currentPath.endsWith("/index.html") ||
            currentPath.endsWith("/coumba-portfolio");

        if (isHomePage && isCurrentHomePage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });


    // 6. VIDÉOS : AFFICHER UN ESPACE RÉSERVÉ SI LE FICHIER EST ABSENT
    document.querySelectorAll(".video-card video source").forEach((source) => {
        source.addEventListener("error", () => {
            const card = source.closest(".video-card");

            if (card) {
                card.classList.add("is-missing");
            }
        });
    });


    // 6 bis. UNE SEULE VIDÉO À LA FOIS
    // Les vidéos ne se chargent qu'au clic (preload="none" dans le HTML).
    // Quand une vidéo démarre, toutes les autres se mettent en pause.
    const allVideos = document.querySelectorAll(".video-card video");

    allVideos.forEach((video) => {
        video.addEventListener("play", () => {
            allVideos.forEach((other) => {
                if (other !== video && !other.paused) {
                    other.pause();
                }
            });
        });
    });


    // 7. AGRANDISSEMENT DES IMAGES (photos et attestation)
    const lightbox = document.getElementById("lightbox");

    if (lightbox && typeof lightbox.showModal === "function") {
        const lightboxImage = lightbox.querySelector("img");
        const lightboxClose = lightbox.querySelector(".lightbox-close");

        document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const thumbnail = trigger.querySelector("img");

                if (!thumbnail || trigger.classList.contains("is-missing")) {
                    return;
                }

                lightboxImage.src = trigger.dataset.full || thumbnail.src;
                lightboxImage.alt = thumbnail.alt;
                lightbox.showModal();
            });
        });

        lightboxClose.addEventListener("click", () => lightbox.close());

        // Fermer en cliquant sur le fond sombre.
        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                lightbox.close();
            }
        });

        lightbox.addEventListener("close", () => {
            lightboxImage.removeAttribute("src");
        });
    }
});