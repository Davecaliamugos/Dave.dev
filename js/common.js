/* ========================================
   SYNAPTIC PORTFOLIO - COMMON JAVASCRIPT
   ======================================== */

// Navigation Configuration
const NAV_SECTIONS = [
    { title: 'HOME', url: 'index.html' },
    { title: 'ABOUT', url: 'about.html' },
    { title: 'SKILLS', url: 'skills.html' },
    { title: 'PROJECTS', url: 'projects.html' },
    { title: 'CERTIFICATES', url: 'certificate.html' },
    { title: 'CONTACT', url: 'contact.html' }
];

// Entrance Animations Observer
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ========================================
// NAVIGATION INITIALIZATION
// ========================================
function initNavigation(currentPage) {
    const nav = document.querySelector('nav');
    const navLinksContainer = document.getElementById('navLinks');
    if (!navLinksContainer || !nav) return;

    // 1. Inject Burger Menu if not present
    let burger = document.getElementById('burger');
    if (!burger) {
        burger = document.createElement('div');
        burger.id = 'burger';
        burger.className = 'burger';
        burger.innerHTML = `
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
        `;
        // Insert before navLinks
        nav.insertBefore(burger, navLinksContainer);
    }

    // 2. Populate Links
    navLinksContainer.innerHTML = NAV_SECTIONS.map((section, index) => {
        const isActive = section.url === currentPage ? 'active' : '';
        // Add style for staggered animation delay
        const delay = index / 7 + 0.3;
        return `<a href="${section.url}" class="nav-item ${isActive}" style="transition-delay: ${delay}s">${section.title}</a>`;
    }).join('');

    // 3. Burger Click Event
    burger.addEventListener('click', () => {
        // Toggle Nav
        navLinksContainer.classList.toggle('nav-active');

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // 4. Close menu when a link is clicked
    navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });
}

// ========================================
// CUSTOM CURSOR
// ========================================
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (!dot || !ring) return;

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
    });
}

// ========================================
// BACKGROUND CANVAS SYSTEM
// ========================================
class BackgroundSystem {
    constructor() {
        this.pCanvas = document.getElementById('particleCanvas');
        this.gCanvas = document.getElementById('gridCanvas');

        if (!this.pCanvas || !this.gCanvas) return;

        this.pCtx = this.pCanvas.getContext('2d');
        this.gCtx = this.gCanvas.getContext('2d');

        this.width = 0;
        this.height = 0;
        this.mouse = { x: 0, y: 0 };
        this.particles = [];

        this.init();
    }

    init() {
        this.resize();

        // Add spotlight element
        this.spotlight = document.createElement('div');
        this.spotlight.style.position = 'fixed';
        this.spotlight.style.top = '0';
        this.spotlight.style.left = '0';
        this.spotlight.style.width = '100vw';
        this.spotlight.style.height = '100vh';
        this.spotlight.style.pointerEvents = 'none';
        this.spotlight.style.zIndex = '0';
        this.spotlight.style.background = 'radial-gradient(circle at center, rgba(78, 217, 255, 0.08) 0%, transparent 70%)';
        this.spotlight.style.transition = 'background 0.1s ease';
        document.body.prepend(this.spotlight);

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            // Move spotlight
            this.spotlight.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(78, 217, 255, 0.12) 0%, transparent 50%)`;
        });
        this.animate();
    }

    resize() {
        this.width = this.pCanvas.width = this.gCanvas.width = window.innerWidth;
        this.height = this.pCanvas.height = this.gCanvas.height = window.innerHeight;
        this.initParticles();
    }

    initParticles() {
        this.particles = [];
        const particleCount = 80; // Reduced from 150 to improve performance

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.25, // Slightly slower movement
                vy: (Math.random() - 0.5) * 0.25,
                size: Math.random() * 1.5 + 0.5
            });
        }
    }

    drawHexGrid() {
        this.gCtx.clearRect(0, 0, this.width, this.height);

        const size = 50;
        const h = size * Math.sqrt(3);
        const w = size * 2;

        this.gCtx.strokeStyle = '#4ed9ff';
        this.gCtx.lineWidth = 1;

        for (let y = 0; y < this.height + h; y += h * 0.86) {
            for (let x = 0; x < this.width + w; x += w * 0.75) {
                const xOff = (Math.floor(y / (h * 0.86)) % 2) * (w * 0.375);
                const cx = x + xOff;
                const cy = y;

                const dist = Math.sqrt((this.mouse.x - cx) ** 2 + (this.mouse.y - cy) ** 2);
                // Increased opacity (0.5 max instead of 0.3)
                this.gCtx.globalAlpha = Math.max(0.1, 0.5 - dist / 500);

                this.gCtx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = i * Math.PI / 3;
                    this.gCtx.lineTo(
                        cx + size * Math.cos(angle),
                        cy + size * Math.sin(angle)
                    );
                }
                this.gCtx.closePath();
                this.gCtx.stroke();
            }
        }
    }

    drawParticles() {
        this.pCtx.clearRect(0, 0, this.width, this.height);

        // Plexus Effect: Connect particles that are close
        this.pCtx.lineWidth = 0.5;
        this.pCtx.strokeStyle = '#4ed9ff';

        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];

            p1.x += p1.vx;
            p1.y += p1.vy;

            if (p1.x < 0 || p1.x > this.width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > this.height) p1.vy *= -1;

            // Simplified connection logic
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy; // Use distance squared (faster)

                if (distSq < 10000) { // 100 * 100
                    const dist = Math.sqrt(distSq);
                    this.pCtx.globalAlpha = (1 - dist / 100) * 0.25;
                    this.pCtx.beginPath();
                    this.pCtx.moveTo(p1.x, p1.y);
                    this.pCtx.lineTo(p2.x, p2.y);
                    this.pCtx.stroke();
                }
            }

            // Draw particle with simple gradient or fill (removing shadowBlur for performance)
            this.pCtx.fillStyle = '#4ed9ff';
            this.pCtx.globalAlpha = 0.6;
            this.pCtx.beginPath();
            this.pCtx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
            this.pCtx.fill();
        }
    }

    animate() {
        this.drawHexGrid();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize custom cursor
    initCustomCursor();

    // Initialize background system
    new BackgroundSystem();

    // Initialize entrance animations
    initRevealAnimations();
});

// Export for manual initialization if needed
window.SynapticPortfolio = {
    initNavigation,
    initCustomCursor,
    BackgroundSystem,
    initRevealAnimations
};
