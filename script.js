// ── GRID CANVAS ──────────────────────────────────────────────
const canvas = document.getElementById('grid-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const GRID  = 60;
const COLOR = 'rgba(58,134,255,0.18)';

let mouseX = -999, mouseY = -999;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width  / GRID) + 1;
    const rows = Math.ceil(canvas.height / GRID) + 1;

    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const x = c * GRID;
            const y = r * GRID;
            const dx = x - mouseX;
            const dy = y - mouseY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const glow = Math.max(0, 1 - dist / 240);

            // dot at intersection
            ctx.beginPath();
            ctx.arc(x, y, glow > 0.1 ? 1.5 + glow * 2 : 1, 0, Math.PI * 2);
            ctx.fillStyle = glow > 0.05
                ? `rgba(58,134,255,${0.15 + glow * 0.5})`
                : COLOR;
            ctx.fill();
        }
    }

    // grid lines
    ctx.strokeStyle = 'rgba(58,134,255,0.06)';
    ctx.lineWidth   = 0.5;

    for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * GRID, 0);
        ctx.lineTo(c * GRID, canvas.height);
        ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * GRID);
        ctx.lineTo(canvas.width, r * GRID);
        ctx.stroke();
    }

    requestAnimationFrame(drawGrid);
}
drawGrid();

// ── TYPEWRITER HERO ───────────────────────────────────────────
const target = '> Dana_Khasanov';
const el     = document.getElementById('typed-name');
let i = 0;

function type() {
    if (i < target.length) {
        el.textContent += target[i++];
        setTimeout(type, i < 3 ? 80 : 60 + Math.random() * 40);
    }
}
setTimeout(type, 400);

// ── NAV SCROLL OPACITY ────────────────────────────────────────
const nav = document.getElementById('nav');

// ── SCROLL REVEAL ─────────────────────────────────────────────
const reveals = document.querySelectorAll(
    '.skill-block, .course-card, .project-card, .exp-item, .contact-row, .about-text, .about-art'
);

reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), idx * 60);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── ACTIVE NAV LINK ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(a => a.style.color = '');
            const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
            if (active) active.style.color = 'var(--accent)';
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));