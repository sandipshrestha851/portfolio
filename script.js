const header = document.querySelector(".site-header");
const navLinks = document.querySelector(".nav-links");
const menuToggle = document.querySelector(".menu-toggle");
const sections = [...document.querySelectorAll("main section[id], main section[id]")];
const navItems = [...document.querySelectorAll(".nav-link")];

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
        menuToggle.classList.remove("open");
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
});

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);

    let current = "home";
    for (const section of sections) {
        if (section.offsetTop <= window.scrollY + 180) current = section.id;
    }
    navItems.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
    revealObserver.observe(element);
});

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name").toString().trim();
    const email = data.get("email").toString().trim();
    const message = data.get("message").toString().trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:sandipshrestha4455@gmail.com?subject=${subject}&body=${body}`;
});

const canvas = document.getElementById("particleCanvas");
const context = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let pointer = { x: -1000, y: -1000 };

function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(canvas.clientWidth * ratio);
    canvas.height = Math.floor(canvas.clientHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = window.innerWidth < 600 ? 24 : window.innerWidth < 980 ? 42 : 70;
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: Math.random() * 1.1 + 0.45
    }));
}

function animateParticles() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.clientWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.clientHeight) particle.vy *= -1;

        const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
        if (pointerDistance < 100) {
            particle.x += (particle.x - pointer.x) * 0.002;
            particle.y += (particle.y - pointer.y) * 0.002;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(148, 163, 184, 0.28)";
        context.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const other = particles[j];
            const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
            if (distance < 105) {
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(other.x, other.y);
                context.strokeStyle = `rgba(59, 130, 246, ${0.055 * (1 - distance / 105)})`;
                context.lineWidth = 0.6;
                context.stroke();
            }
        }
    }
    if (!reduceMotion) requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
}, { passive: true });
window.addEventListener("pointerleave", () => {
    pointer = { x: -1000, y: -1000 };
});

resizeCanvas();
if (reduceMotion) animateParticles();
else requestAnimationFrame(animateParticles);
