// ── GRID CANVAS + PARTICLES + COMETS ─────────────────────────
const canvas = document.getElementById('grid-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

const GRID  = 60;
let mouseX = -999, mouseY = -999;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

// ── FLOATING PARTICLES ────────────────────────────────────────
let particles = [];

function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 28000);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.18,
            dy: (Math.random() - 0.5) * 0.18,
            opacity: Math.random() * 0.5 + 0.1,
            pulse: Math.random() * Math.PI * 2,
        });
    }
}
initParticles();

// ── COMETS ────────────────────────────────────────────────────
let comets = [];

function spawnComet() {
    const fromTop = Math.random() > 0.5;
    comets.push({
        x: fromTop ? Math.random() * canvas.width : 0,
        y: fromTop ? 0 : Math.random() * canvas.height,
        len: Math.random() * 120 + 60,
        speed: Math.random() * 3 + 2,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        life: 1,
    });
}

// spawn a comet every 4-8 seconds
setInterval(spawnComet, Math.random() * 4000 + 4000);

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = Math.ceil(canvas.width  / GRID) + 1;
    const rows = Math.ceil(canvas.height / GRID) + 1;

    // grid lines
    ctx.strokeStyle = 'rgba(58,134,255,0.05)';
    ctx.lineWidth   = 0.5;
    for (let c = 0; c <= cols; c++) {
        ctx.beginPath(); ctx.moveTo(c * GRID, 0); ctx.lineTo(c * GRID, canvas.height); ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * GRID); ctx.lineTo(canvas.width, r * GRID); ctx.stroke();
    }

    // grid dots with mouse glow
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const x = c * GRID, y = r * GRID;
            const dist = Math.hypot(x - mouseX, y - mouseY);
            const glow = Math.max(0, 1 - dist / 220);
            ctx.beginPath();
            ctx.arc(x, y, glow > 0.05 ? 1.5 + glow * 2.5 : 0.8, 0, Math.PI * 2);
            ctx.fillStyle = glow > 0.05
                ? `rgba(58,134,255,${0.15 + glow * 0.6})`
                : 'rgba(58,134,255,0.12)';
            ctx.fill();
        }
    }

    // floating particles
    const t = Date.now() * 0.001;
    for (const p of particles) {
        p.x += p.dx; p.y += p.dy;
        p.pulse += 0.02;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58,134,255,${alpha})`;
        ctx.fill();
    }

    // comets
    comets = comets.filter(c => c.life > 0);
    for (const c of comets) {
        c.x += Math.cos(c.angle) * c.speed;
        c.y += Math.sin(c.angle) * c.speed;
        c.life -= 0.008;

        const tailX = c.x - Math.cos(c.angle) * c.len;
        const tailY = c.y - Math.sin(c.angle) * c.len;
        const grad = ctx.createLinearGradient(tailX, tailY, c.x, c.y);
        grad.addColorStop(0, 'rgba(58,134,255,0)');
        grad.addColorStop(1, `rgba(180,210,255,${c.life * 0.7})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(c.x, c.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // comet head glow
        const headGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 6);
        headGrad.addColorStop(0, `rgba(200,225,255,${c.life * 0.9})`);
        headGrad.addColorStop(1, 'rgba(58,134,255,0)');
        ctx.beginPath();
        ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();
    }

    requestAnimationFrame(drawAll);
}
drawAll();

// ── TYPEWRITER HERO ───────────────────────────────────────────
const target = '> Dana_Khasanov';
const el     = document.getElementById('typed-name');
let i = 0;

function type() {
    if (i < target.length) {
        el.textContent += target[i++];
        setTimeout(type, i < 3 ? 80 : 55 + Math.random() * 45);
    }
}
setTimeout(type, 400);

// ── SCROLL REVEAL ─────────────────────────────────────────────
const reveals = document.querySelectorAll(
    '.skill-block, .course-card, .project-card, .exp-item, .contact-row, .about-text, .about-art, .resume-card'
);
reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), idx * 55);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
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
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));