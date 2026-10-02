/* =====================================================
   PREMIUM LOADER
===================================================== */

const loader = document.getElementById("premiumLoader");
const loaderProgress = document.getElementById("loaderProgress");
const loaderPercent = document.getElementById("loaderPercent");
const loaderStatus = document.getElementById("loaderStatus");

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
let messageIndex = 0;
let loadingStarted = false;
let loadingFinished = false;

function updateLoader() {
    loadingValue += Math.floor(Math.random() * 8) + 3;

    if (loadingValue > 100) {
        loadingValue = 100;
    }

    loaderProgress.style.width = loadingValue + "%";
    loaderPercent.textContent = loadingValue + "%";

    const newIndex = Math.min(
        Math.floor(loadingValue / 16),
        loaderMessages.length - 1
    );

    if (newIndex !== messageIndex) {
        messageIndex = newIndex;
        loaderStatus.style.opacity = "0";

        setTimeout(() => {
            loaderStatus.textContent = loaderMessages[messageIndex];
            loaderStatus.style.opacity = "1";
        }, 150);
    }

    if (loadingValue >= 100) {
        finishLoading();
        return;
    }

    setTimeout(updateLoader, 90 + Math.random() * 120);
}

function finishLoading() {
    if (loadingFinished) return;
    loadingFinished = true;

    loaderProgress.style.width = "100%";
    loaderPercent.textContent = "100%";
    loaderStatus.textContent = "Welcome.";

    setTimeout(() => {
        document.body.classList.add("page-ready");
        document.body.classList.remove("loader-active");
        loader.classList.add("loaded");
        document.body.style.overflowX = "hidden";

        setTimeout(() => {
            loader.remove();
        }, 1000);

        startReveal();
    }, 500);
}

function startLoader() {
    if (loadingStarted) return;
    loadingStarted = true;
    setTimeout(updateLoader, 180);
    setTimeout(finishLoading, 4200);
}

document.addEventListener("DOMContentLoaded", startLoader, { once: true });
if (document.readyState !== "loading") startLoader();

window.addEventListener("load", () => {
    if (loadingStarted && !loadingFinished) {
        setTimeout(() => {
            if (loadingValue > 72) finishLoading();
        }, 180);
    }
}, { once: true });


/* =====================================================
   REVEAL
===================================================== */

let revealStarted = false;

function startReveal() {
    if (revealStarted) return;
    revealStarted = true;

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: .10 }
    );

    document.querySelectorAll(".reveal").forEach(element => {
        revealObserver.observe(element);
    });
}


/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileMenu.classList.toggle("hidden", !isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.querySelector("i").classList.toggle("bx-menu", !isOpen);
    menuBtn.querySelector("i").classList.toggle("bx-x", isOpen);
});

document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        mobileMenu.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.querySelector("i").classList.remove("bx-x");
        menuBtn.querySelector("i").classList.add("bx-menu");
    });
});


/* =====================================================
   SCROLL PROGRESS
===================================================== */

const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;

    scrollProgress.style.width = progress + "%";
}, { passive: true });


/* =====================================================
   TYPING
===================================================== */

const typingElement = document.querySelector(".typing");

const typingTexts = [
    "Programmer",
    "Front-End Developer",
    "Web Designer",
    "Creative Developer",
    "pah minta duit buat beli pulsa"
];

let textIndex = 0;
let charIndex = 0;
let deleting = false;

function typingEffect() {
    const current = typingTexts[textIndex];

    if (!deleting) {
        typingElement.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
            deleting = true;
            setTimeout(typingEffect, 1400);
            return;
        }
    } else {
        typingElement.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }
    }

    setTimeout(typingEffect, deleting ? 50 : 100);
}

typingEffect();


/* =====================================================
   COUNTER
===================================================== */

const counters = document.querySelectorAll("[data-counter]");

const counterObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const element = entry.target;
            const target = Number(element.dataset.counter);
            const suffix = element.dataset.suffix || "";
            const duration = 1300;
            const startTime = performance.now();

            function animateCounter(time) {
                const progress = Math.min((time - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                element.textContent = current + suffix;

                if (progress < 1) {
                    requestAnimationFrame(animateCounter);
                } else {
                    element.textContent = target + suffix;
                }
            }

            requestAnimationFrame(animateCounter);
            counterObserver.unobserve(element);
        });
    },
    { threshold: .7 }
);

counters.forEach(counter => {
    counterObserver.observe(counter);
});


/* =====================================================
   MAGNETIC BUTTONS
===================================================== */

const magneticElements = document.querySelectorAll(".magnetic");

if (window.matchMedia("(pointer:fine)").matches) {
    magneticElements.forEach(element => {
        element.addEventListener("mousemove", event => {
            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * .12}px, ${y * .12}px)`;
        });

        element.addEventListener("mouseleave", () => {
            element.style.transform = "";
        });
    });
}


/* =====================================================
   3D TILT
===================================================== */

const tiltCards = document.querySelectorAll(".tilt-card");

if (window.matchMedia("(pointer:fine)").matches) {
    tiltCards.forEach(card => {
        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}


/* =====================================================
   PORTFOLIO FILTER
===================================================== */

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const searchInput = document.getElementById("projectSearch");
const projectCount = document.getElementById("projectCount");
const emptyProjects = document.getElementById("emptyProjects");
const resetProjects = document.getElementById("resetProjects");

let currentFilter = "all";

function updateProjects() {
    const search = searchInput.value.toLowerCase().trim();
    let visible = 0;

    projectCards.forEach(card => {
        const category = card.dataset.category;
        const title = card.dataset.title.toLowerCase();

        const filterMatch = currentFilter === "all" || category === currentFilter;
        const searchMatch = title.includes(search);

        if (filterMatch && searchMatch) {
            card.style.display = "";
            visible++;

            requestAnimationFrame(() => {
                card.style.opacity = "1";
                card.style.transform = "";
            });
        } else {
            card.style.display = "none";
        }
    });

    projectCount.textContent = `${visible} project`;

    if (emptyProjects) {
        emptyProjects.hidden = visible !== 0;
    }
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");
        currentFilter = button.dataset.filter;

        updateProjects();
    });
});

searchInput.addEventListener("input", updateProjects);

resetProjects?.addEventListener("click", () => {
    searchInput.value = "";
    currentFilter = "all";
    filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === "all"));
    updateProjects();
});


/* =====================================================
   PROJECT MODAL
===================================================== */

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalImage = document.getElementById("modalImage");
const modalLink = document.getElementById("modalLink");
const modalClose = document.getElementById("modalClose");

document.querySelectorAll(".project-open").forEach(button => {
    button.addEventListener("click", () => {
        modalTitle.textContent = button.dataset.title;
        modalDescription.textContent = button.dataset.description;
        modalImage.src = button.dataset.image;
        modalImage.alt = button.dataset.title;
        modalLink.href = button.dataset.link;
        modalLink.textContent = button.dataset.linkText || "Buka Project";

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});

function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});


/* =====================================================
   BACK TO TOP
===================================================== */

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
        backToTop.classList.remove(
            "opacity-0",
            "pointer-events-none",
            "translate-y-3"
        );
    } else {
        backToTop.classList.add(
            "opacity-0",
            "pointer-events-none",
            "translate-y-3"
        );
    }
}, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


/* =====================================================
   THEME
===================================================== */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const savedTheme = localStorage.getItem("portfolio-theme");

function applyTheme(theme) {
    if (theme === "light") {
        document.body.classList.add("light");
        themeIcon.classList.remove("bx-moon");
        themeIcon.classList.add("bx-sun");
        themeToggle.setAttribute("aria-pressed", "true");
    } else {
        document.body.classList.remove("light");
        themeIcon.classList.remove("bx-sun");
        themeIcon.classList.add("bx-moon");
        themeToggle.setAttribute("aria-pressed", "false");
    }
}

applyTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light");
    const newTheme = isLight ? "dark" : "light";

    applyTheme(newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
});


/* =====================================================
   CHARACTER COUNTER
===================================================== */

const messageInput = document.getElementById("message");
const charCount = document.getElementById("charCount");

messageInput.addEventListener("input", () => {
    charCount.textContent = `${messageInput.value.length}/500`;
});


/* =====================================================
   TOAST
===================================================== */

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =====================================================
   EMAILJS
===================================================== */

emailjs.init({
    publicKey: "a4l-EnePjKB1ZRK7d"
});

const contactForm = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");
const submitText = document.getElementById("submitText");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async event => {
    event.preventDefault();

    submitButton.disabled = true;
    submitText.textContent = "Mengirim...";
    formStatus.textContent = "Sedang mengirim pesan...";

    try {
        await emailjs.sendForm(
            "m1t2h3u4f5a6i7l8",
            "template_o3iggru",
            contactForm
        );

        showToast("Pesan berhasil dikirim!");

        formStatus.textContent = "Pesan berhasil dikirim.";
        formStatus.className = "text-xs text-green-400";

        contactForm.reset();
        charCount.textContent = "0/500";
    } catch (error) {
        console.error("EmailJS Error:", error);

        showToast("Gagal mengirim pesan.");

        formStatus.textContent = "Gagal mengirim pesan. Coba lagi.";
        formStatus.className = "text-xs text-red-400";
    }

    submitButton.disabled = false;
    submitText.textContent = "Kirim Pesan";
});


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("text-yellow-300");

        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("text-yellow-300", "active");
        }
    });
}, { passive: true });


/* =====================================================
   FOOTER YEAR
===================================================== */

document.getElementById("year").textContent = new Date().getFullYear();


/* =====================================================
   CURSOR GLOW
===================================================== */

const cursorGlow = document.getElementById("cursorGlow");

if (window.matchMedia("(pointer:fine)").matches) {
    document.addEventListener("mousemove", event => {
        cursorGlow.style.left = event.clientX + "px";
        cursorGlow.style.top = event.clientY + "px";
    });
}


/* =====================================================
   HERO PARALLAX
===================================================== */

const heroVisual = document.getElementById("heroVisual");

if (heroVisual && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", event => {
        const x = (event.clientX / window.innerWidth) - .5;
        const y = (event.clientY / window.innerHeight) - .5;

        heroVisual.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
    });
}


/* =====================================================
   SPOTLIGHT INITIALIZATION
===================================================== */

if (
    window.matchMedia("(pointer:fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
    document.querySelectorAll(".modern-card").forEach(card => {
        card.classList.add("spotlight-card");

        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();

            card.style.setProperty("--spot-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
            card.style.setProperty("--spot-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
        }, { passive: true });
    });
}