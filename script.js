/* =====================================================
   PREMIUM PORTFOLIO JAVASCRIPT
   LIGHTWEIGHT + PERFORMANCE OPTIMIZED
===================================================== */

"use strict";


/* =====================================================
   UTILITY
===================================================== */

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer =
    window.matchMedia("(pointer: fine)").matches;


/* =====================================================
   PREMIUM LOADER
===================================================== */

const loader = $("#premiumLoader");
const loaderProgress = $("#loaderProgress");
const loaderPercent = $("#loaderPercent");
const loaderStatus = $("#loaderStatus");

const loaderMessages = [
    "Initializing...",
    "Preparing interface...",
    "Loading projects...",
    "Loading creative assets...",
    "Connecting components...",
    "Almost ready...",
    "Welcome."
];

let loadingValue = 0;
let loadingStarted = false;
let loadingFinished = false;
let loaderTimer = null;

function updateLoader() {

    if (!loader || !loaderProgress || !loaderPercent) {
        finishLoading();
        return;
    }

    loadingValue += Math.floor(Math.random() * 8) + 3;

    if (loadingValue > 100) {
        loadingValue = 100;
    }

    loaderProgress.style.width = `${loadingValue}%`;
    loaderPercent.textContent = `${loadingValue}%`;

    const messageIndex = Math.min(
        Math.floor(loadingValue / 16),
        loaderMessages.length - 1
    );

    if (loaderStatus) {
        loaderStatus.textContent =
            loaderMessages[messageIndex];
    }

    if (loadingValue >= 100) {
        finishLoading();
        return;
    }

    loaderTimer = setTimeout(
        updateLoader,
        90 + Math.random() * 100
    );
}


function finishLoading() {

    if (loadingFinished) return;

    loadingFinished = true;

    if (loaderTimer) {
        clearTimeout(loaderTimer);
    }

    if (loaderProgress) {
        loaderProgress.style.width = "100%";
    }

    if (loaderPercent) {
        loaderPercent.textContent = "100%";
    }

    if (loaderStatus) {
        loaderStatus.textContent = "Welcome.";
    }

    setTimeout(() => {

        document.body.classList.add("page-ready");
        document.body.classList.remove("loader-active");

        if (loader) {
            loader.classList.add("loaded");
        }

        document.body.style.overflowX = "hidden";

        startReveal();

        setTimeout(() => {

            if (loader) {
                loader.remove();
            }

        }, 700);

    }, 400);
}


function startLoader() {

    if (loadingStarted) return;

    loadingStarted = true;

    setTimeout(updateLoader, 150);

    setTimeout(() => {

        if (!loadingFinished) {
            finishLoading();
        }

    }, 4200);
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        startLoader,
        { once: true }
    );

} else {

    startLoader();

}


window.addEventListener(
    "load",
    () => {

        if (
            loadingStarted &&
            !loadingFinished &&
            loadingValue > 70
        ) {
            setTimeout(finishLoading, 150);
        }

    },
    { once: true }
);


/* =====================================================
   REVEAL
===================================================== */

let revealStarted = false;

function startReveal() {

    if (revealStarted) return;

    revealStarted = true;

    const elements = $$(".reveal");

    if (!elements.length) return;

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {

        elements.forEach(element => {
            element.classList.add("show");
        });

        return;
    }

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("show");

                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            }
        );

    elements.forEach(element => {
        revealObserver.observe(element);
    });
}


/* =====================================================
   PREMIUM CARD REVEAL
===================================================== */

function initPremiumReveal() {

    if (prefersReducedMotion) return;

    const elements = $$(
        ".project-card, .modern-card, .skill-card, .service-card, .about-card"
    );

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) return;

    elements.forEach((element, index) => {

        element.classList.add("premium-reveal");

        element.style.setProperty(
            "--stagger-delay",
            `${Math.min(index * 50, 300)}ms`
        );

    });

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add(
                        "premium-visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -30px 0px"
            }
        );

    elements.forEach(element => {
        observer.observe(element);
    });
}


/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

if (menuBtn && mobileMenu) {

    const menuIcon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", () => {

        const isOpen =
            mobileMenu.classList.toggle("open");

        mobileMenu.classList.toggle(
            "hidden",
            !isOpen
        );

        menuBtn.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        if (menuIcon) {

            menuIcon.classList.toggle(
                "bx-menu",
                !isOpen
            );

            menuIcon.classList.toggle(
                "bx-x",
                isOpen
            );

        }

    });


    $$(".mobile-link").forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");
            mobileMenu.classList.add("hidden");

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            if (menuIcon) {

                menuIcon.classList.remove("bx-x");
                menuIcon.classList.add("bx-menu");

            }

        });

    });

}


/* =====================================================
   SCROLL ELEMENTS
===================================================== */

const scrollProgress = $("#scrollProgress");
const backToTop = $("#backToTop");
const navbar = $("nav");

let scrollTicking = false;
let lastScrollY = window.scrollY;
let currentSection = "";


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections = $$("section[id]");
const navLinks = $$(".nav-link");


function updateActiveNavigation(scrollY) {

    if (!sections.length) return;

    let active = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        if (scrollY >= sectionTop) {
            active = section.id;
        }

    });

    if (active === currentSection) return;

    currentSection = active;

    navLinks.forEach(link => {

        const isActive =
            link.getAttribute("href") === `#${active}`;

        link.classList.toggle(
            "text-yellow-300",
            isActive
        );

        link.classList.toggle(
            "active",
            isActive
        );

    });
}


/* =====================================================
   SCROLL HANDLER
   Semua fungsi scroll digabung menjadi satu
===================================================== */

function handleScroll() {

    const scrollY = window.scrollY;

    /* -------------------------------
       Scroll Progress
    ------------------------------- */

    if (scrollProgress) {

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress =
            documentHeight > 0
                ? (scrollY / documentHeight) * 100
                : 0;

        scrollProgress.style.width =
            `${progress}%`;

    }


    /* -------------------------------
       Back To Top
    ------------------------------- */

    if (backToTop) {

        const visible = scrollY > 500;

        backToTop.classList.toggle(
            "opacity-0",
            !visible
        );

        backToTop.classList.toggle(
            "pointer-events-none",
            !visible
        );

        backToTop.classList.toggle(
            "translate-y-3",
            !visible
        );

    }


    /* -------------------------------
       Navbar
    ------------------------------- */

    if (navbar) {

        navbar.classList.toggle(
            "navbar-scrolled",
            scrollY > 80
        );

        if (
            !prefersReducedMotion &&
            window.innerWidth > 768
        ) {

            if (
                scrollY > lastScrollY &&
                scrollY > 300
            ) {

                navbar.classList.add(
                    "navbar-hidden"
                );

            } else {

                navbar.classList.remove(
                    "navbar-hidden"
                );

            }

        }

    }


    /* -------------------------------
       Active Navigation
    ------------------------------- */

    updateActiveNavigation(scrollY);


    lastScrollY = scrollY;

    scrollTicking = false;
}


window.addEventListener(
    "scroll",
    () => {

        if (!scrollTicking) {

            requestAnimationFrame(
                handleScroll
            );

            scrollTicking = true;

        }

    },
    { passive: true }
);


/* =====================================================
   BACK TO TOP
===================================================== */

if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

        }
    );

}


/* =====================================================
   TYPING EFFECT
===================================================== */

const typingElement = $(".typing");

const typingTexts = [
    "Programmer",
    "Front-End Developer",
    "Web Designer",
    "Creative Developer"
];

let textIndex = 0;
let charIndex = 0;
let deleting = false;
let typingTimer = null;


function typingEffect() {

    if (!typingElement) return;

    const current =
        typingTexts[textIndex];

    if (!deleting) {

        typingElement.textContent =
            current.substring(
                0,
                charIndex + 1
            );

        charIndex++;

        if (charIndex >= current.length) {

            deleting = true;

            typingTimer = setTimeout(
                typingEffect,
                1400
            );

            return;
        }

    } else {

        typingElement.textContent =
            current.substring(
                0,
                charIndex - 1
            );

        charIndex--;

        if (charIndex <= 0) {

            charIndex = 0;
            deleting = false;

            textIndex =
                (textIndex + 1) %
                typingTexts.length;

        }

    }

    typingTimer = setTimeout(
        typingEffect,
        deleting ? 45 : 90
    );
}


if (
    typingElement &&
    !prefersReducedMotion
) {
    typingEffect();
}


/* =====================================================
   COUNTER
===================================================== */

const counters = $$("[data-counter]");

if (
    counters.length &&
    "IntersectionObserver" in window
) {

    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const element =
                        entry.target;

                    const target =
                        Number(
                            element.dataset.counter
                        ) || 0;

                    const suffix =
                        element.dataset.suffix || "";

                    if (prefersReducedMotion) {

                        element.textContent =
                            target + suffix;

                        counterObserver.unobserve(
                            element
                        );

                        return;
                    }

                    const duration = 1100;
                    const startTime =
                        performance.now();

                    function animateCounter(time) {

                        const progress =
                            Math.min(
                                (time - startTime) /
                                duration,
                                1
                            );

                        const eased =
                            1 -
                            Math.pow(
                                1 - progress,
                                3
                            );

                        const current =
                            Math.floor(
                                eased * target
                            );

                        element.textContent =
                            current + suffix;

                        if (progress < 1) {

                            requestAnimationFrame(
                                animateCounter
                            );

                        } else {

                            element.textContent =
                                target + suffix;

                        }

                    }

                    requestAnimationFrame(
                        animateCounter
                    );

                    counterObserver.unobserve(
                        element
                    );

                });

            },
            {
                threshold: 0.6
            }
        );


    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

}


/* =====================================================
   MAGNETIC BUTTONS
===================================================== */

if (
    finePointer &&
    !prefersReducedMotion
) {

    $$(".magnetic").forEach(element => {

        let rect = null;

        element.addEventListener(
            "mouseenter",
            () => {
                rect =
                    element.getBoundingClientRect();
            }
        );

        element.addEventListener(
            "mousemove",
            event => {

                if (!rect) {
                    rect =
                        element.getBoundingClientRect();
                }

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;

                element.style.transform =
                    `translate3d(${x * 0.10}px, ${y * 0.10}px, 0)`;

            },
            { passive: true }
        );

        element.addEventListener(
            "mouseleave",
            () => {

                element.style.transform = "";
                rect = null;

            }
        );

    });

}


/* =====================================================
   3D TILT
===================================================== */

if (
    finePointer &&
    !prefersReducedMotion
) {

    $$(".tilt-card").forEach(card => {

        let rect = null;

        card.addEventListener(
            "mouseenter",
            () => {
                rect =
                    card.getBoundingClientRect();
            }
        );

        card.addEventListener(
            "mousemove",
            event => {

                if (!rect) {
                    rect =
                        card.getBoundingClientRect();
                }

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) /
                        centerY) * -2.5;

                const rotateY =
                    ((x - centerX) /
                        centerX) * 2.5;

                card.style.transform =
                    `perspective(900px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translate3d(0, -4px, 0)`;

            },
            { passive: true }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform = "";
                rect = null;

            }
        );

    });

}


/* =====================================================
   PORTFOLIO FILTER
===================================================== */

const filterButtons =
    $$(".filter-btn");

const projectCards =
    $$(".project-card");

const searchInput =
    $("#projectSearch");

const projectCount =
    $("#projectCount");

const emptyProjects =
    $("#emptyProjects");

const resetProjects =
    $("#resetProjects");

let currentFilter = "all";


function updateProjects() {

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

    let visible = 0;

    projectCards.forEach(card => {

        const category =
            card.dataset.category || "";

        const title =
            card.dataset.title
                ? card.dataset.title.toLowerCase()
                : card.textContent.toLowerCase();

        const filterMatch =
            currentFilter === "all" ||
            category === currentFilter;

        const searchMatch =
            title.includes(search);

        const shouldShow =
            filterMatch && searchMatch;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visible++;
        }

    });


    if (projectCount) {

        projectCount.textContent =
            `${visible} project${visible !== 1 ? "s" : ""}`;

    }


    if (emptyProjects) {

        emptyProjects.hidden =
            visible !== 0;

    }

}


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter =
                button.dataset.filter || "all";

            updateProjects();

        }
    );

});


if (searchInput) {

    searchInput.addEventListener(
        "input",
        updateProjects
    );

}


if (resetProjects) {

    resetProjects.addEventListener(
        "click",
        () => {

            if (searchInput) {
                searchInput.value = "";
            }

            currentFilter = "all";

            filterButtons.forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn.dataset.filter === "all"
                );

            });

            updateProjects();

        }
    );

}

updateProjects();


/* =====================================================
   PROJECT MODAL
===================================================== */

const modal =
    $("#projectModal");

const modalTitle =
    $("#modalTitle");

const modalDescription =
    $("#modalDescription");

const modalImage =
    $("#modalImage");

const modalLink =
    $("#modalLink");

const modalClose =
    $("#modalClose");


$$(".project-open").forEach(button => {

    button.addEventListener(
        "click",
        () => {

            if (modalTitle) {

                modalTitle.textContent =
                    button.dataset.title || "";

            }

            if (modalDescription) {

                modalDescription.textContent =
                    button.dataset.description || "";

            }

            if (modalImage) {

                modalImage.src =
                    button.dataset.image || "";

                modalImage.alt =
                    button.dataset.title || "";

            }

            if (modalLink) {

                modalLink.href =
                    button.dataset.link || "#";

                modalLink.textContent =
                    button.dataset.linkText ||
                    "Buka Project";

            }

            if (modal) {

                modal.classList.add("active");

                document.body.style.overflow =
                    "hidden";

            }

        }
    );

});


function closeModal() {

    if (!modal) return;

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


if (modalClose) {
    modalClose.addEventListener(
        "click",
        closeModal
    );
}


if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {
                closeModal();
            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeModal();
        }

    }
);


/* =====================================================
   THEME
   OPTIMIZED LIGHT / DARK MODE
===================================================== */

const themeToggle =
    $("#themeToggle");

const themeIcon =
    $("#themeIcon");

const savedTheme =
    localStorage.getItem("portfolio-theme");


function applyTheme(theme, save = false) {

    const isLight =
        theme === "light";

    /*
       Gunakan attribute/class hanya satu kali.
       Tidak menggunakan transition pada seluruh body.
    */

    document.body.classList.toggle(
        "light",
        isLight
    );


    if (themeIcon) {

        themeIcon.classList.toggle(
            "bx-sun",
            isLight
        );

        themeIcon.classList.toggle(
            "bx-moon",
            !isLight
        );

    }


    if (themeToggle) {

        themeToggle.setAttribute(
            "aria-pressed",
            String(isLight)
        );

    }


    if (save) {

        localStorage.setItem(
            "portfolio-theme",
            theme
        );

    }

}


/*
   Terapkan tema SEBELUM animasi dimulai.
*/

applyTheme(
    savedTheme === "light"
        ? "light"
        : "dark"
);


if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            const isLight =
                document.body.classList.contains(
                    "light"
                );

            applyTheme(
                isLight ? "dark" : "light",
                true
            );

        }
    );

}


/* =====================================================
   CHARACTER COUNTER
===================================================== */

const messageInput =
    $("#message");

const charCount =
    $("#charCount");


if (
    messageInput &&
    charCount
) {

    messageInput.addEventListener(
        "input",
        () => {

            charCount.textContent =
                `${messageInput.value.length}/500`;

        }
    );

}


/* =====================================================
   TOAST
===================================================== */

const toast =
    $("#toast");

const toastMessage =
    $("#toastMessage");

let toastTimer = null;


function showToast(message) {

    if (!toast || !toastMessage) return;

    toastMessage.textContent =
        message;

    toast.classList.add("show");

    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    toastTimer = setTimeout(
        () => {
            toast.classList.remove("show");
        },
        3000
    );

}


/* =====================================================
   EMAILJS
===================================================== */

if (
    typeof emailjs !== "undefined"
) {

    emailjs.init({
        publicKey: "a4l-EnePjKB1ZRK7d"
    });

    const contactForm =
        $("#contactForm");

    const submitButton =
        $("#submitButton");

    const submitText =
        $("#submitText");

    const formStatus =
        $("#formStatus");


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                if (submitButton) {
                    submitButton.disabled = true;
                }

                if (submitText) {
                    submitText.textContent =
                        "Mengirim...";
                }

                if (formStatus) {
                    formStatus.textContent =
                        "Sedang mengirim pesan...";
                }

                try {

                    await emailjs.sendForm(
                        "m1t2h3u4f5a6i7l8",
                        "template_o3iggru",
                        contactForm
                    );

                    showToast(
                        "Pesan berhasil dikirim!"
                    );

                    if (formStatus) {

                        formStatus.textContent =
                            "Pesan berhasil dikirim.";

                        formStatus.className =
                            "text-xs text-green-400";

                    }

                    contactForm.reset();

                    if (charCount) {
                        charCount.textContent =
                            "0/500";
                    }

                } catch (error) {

                    console.error(
                        "EmailJS Error:",
                        error
                    );

                    showToast(
                        "Gagal mengirim pesan."
                    );

                    if (formStatus) {

                        formStatus.textContent =
                            "Gagal mengirim pesan. Coba lagi.";

                        formStatus.className =
                            "text-xs text-red-400";

                    }

                } finally {

                    if (submitButton) {
                        submitButton.disabled = false;
                    }

                    if (submitText) {
                        submitText.textContent =
                            "Kirim Pesan";
                    }

                }

            }
        );

    }

}


/* =====================================================
   CURSOR GLOW
===================================================== */

const cursorGlow =
    $("#cursorGlow");


if (
    cursorGlow &&
    finePointer &&
    !prefersReducedMotion
) {

    let cursorX = 0;
    let cursorY = 0;

    let glowX = 0;
    let glowY = 0;

    let glowRunning = false;


    document.addEventListener(
        "mousemove",
        event => {

            cursorX = event.clientX;
            cursorY = event.clientY;

            if (!glowRunning) {

                glowRunning = true;

                requestAnimationFrame(
                    animateCursorGlow
                );

            }

        },
        { passive: true }
    );


    function animateCursorGlow() {

        glowX +=
            (cursorX - glowX) * 0.16;

        glowY +=
            (cursorY - glowY) * 0.16;

        cursorGlow.style.transform =
            `translate3d(${glowX}px, ${glowY}px, 0)`;

        const finished =
            Math.abs(cursorX - glowX) < 0.5 &&
            Math.abs(cursorY - glowY) < 0.5;

        if (finished) {

            glowRunning = false;

        } else {

            requestAnimationFrame(
                animateCursorGlow
            );

        }

    }

}


/* =====================================================
   HERO PARALLAX
===================================================== */

const heroVisual =
    $("#heroVisual");


if (
    heroVisual &&
    finePointer &&
    !prefersReducedMotion
) {

    let parallaxX = 0;
    let parallaxY = 0;

    let targetX = 0;
    let targetY = 0;

    let parallaxRunning = false;


    document.addEventListener(
        "mousemove",
        event => {

            targetX =
                (event.clientX /
                    window.innerWidth - 0.5) * 10;

            targetY =
                (event.clientY /
                    window.innerHeight - 0.5) * 10;

            if (!parallaxRunning) {

                parallaxRunning = true;

                requestAnimationFrame(
                    animateHeroParallax
                );

            }

        },
        { passive: true }
    );


    function animateHeroParallax() {

        parallaxX +=
            (targetX - parallaxX) * 0.08;

        parallaxY +=
            (targetY - parallaxY) * 0.08;

        heroVisual.style.transform =
            `translate3d(${parallaxX}px, ${parallaxY}px, 0)`;

        if (
            Math.abs(targetX - parallaxX) < 0.1 &&
            Math.abs(targetY - parallaxY) < 0.1
        ) {

            parallaxRunning = false;

        } else {

            requestAnimationFrame(
                animateHeroParallax
            );

        }

    }

}


/* =====================================================
   SPOTLIGHT
===================================================== */

if (
    finePointer &&
    !prefersReducedMotion
) {

    $$(".modern-card").forEach(card => {

        card.classList.add(
            "spotlight-card"
        );

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left) /
                        rect.width) * 100;

                const y =
                    ((event.clientY - rect.top) /
                        rect.height) * 100;

                card.style.setProperty(
                    "--spot-x",
                    `${x}%`
                );

                card.style.setProperty(
                    "--spot-y",
                    `${y}%`
                );

            },
            { passive: true }
        );

    });

}


/* =====================================================
   BUTTON RIPPLE
===================================================== */

if (!prefersReducedMotion) {

    $$(
        "button:not(.no-ripple), .btn, .magnetic"
    ).forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const rect =
                    button.getBoundingClientRect();

                const size =
                    Math.max(
                        rect.width,
                        rect.height
                    );

                const ripple =
                    document.createElement("span");

                ripple.className =
                    "button-ripple";

                ripple.style.width =
                    `${size}px`;

                ripple.style.height =
                    `${size}px`;

                ripple.style.left =
                    `${event.clientX -
                        rect.left -
                        size / 2}px`;

                ripple.style.top =
                    `${event.clientY -
                        rect.top -
                        size / 2}px`;

                button.appendChild(ripple);

                setTimeout(
                    () => ripple.remove(),
                    650
                );

            }
        );

    });

}


/* =====================================================
   IMAGE HOVER
===================================================== */

if (
    finePointer &&
    !prefersReducedMotion
) {

    $$(".project-card img").forEach(image => {

        image.addEventListener(
            "mouseenter",
            () => {
                image.classList.add(
                    "image-hover"
                );
            }
        );

        image.addEventListener(
            "mouseleave",
            () => {
                image.classList.remove(
                    "image-hover"
                );
            }
        );

    });

}


/* =====================================================
   FLOATING ELEMENTS
===================================================== */

if (!prefersReducedMotion) {

    $$(".floating, .hero-card, .hero-badge")
        .forEach((element, index) => {

            element.animate(
                [
                    {
                        transform:
                            "translate3d(0, 0, 0)"
                    },
                    {
                        transform:
                            "translate3d(0, -8px, 0)"
                    },
                    {
                        transform:
                            "translate3d(0, 0, 0)"
                    }
                ],
                {
                    duration:
                        3200 + index * 250,

                    iterations:
                        Infinity,

                    easing:
                        "ease-in-out"
                }
            );

        });

}


/* =====================================================
   FOOTER YEAR
===================================================== */

const yearElement =
    $("#year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =====================================================
   INITIALIZE
===================================================== */

initPremiumReveal();

requestAnimationFrame(() => {
    handleScroll();
});

document.body.classList.add(
    "animations-ready"
);