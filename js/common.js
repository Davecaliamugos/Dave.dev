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
            } else {
                // Remove if you want it to fade out when scrolling away
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the bottom
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ========================================
// SYSTEM PRELOADER
// ========================================
function initPreloader() {
    // Create preloader HTML if it doesn't exist
    if (!document.querySelector('.preloader')) {
        const preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="loader-terminal">
                <span class="loader-text loading-glitch" data-text="Loading...">Loading...</span>
                <div class="loader-bar-container">
                    <div class="loader-bar"></div>
                </div>
                <div class="loader-status">
                    <span>Connecting to portfolio</span>
                    <span>100%</span>
                </div>
            </div>
        `;
        document.body.prepend(preloader);
    }

    // Handle removal
    const removeLoader = () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.remove();
                }, 1000); // Wait for transition
            }, 800); // Show for at least 800ms
        }
    };

    if (document.readyState === 'complete') {
        removeLoader();
    } else {
        window.addEventListener('load', removeLoader);
    }
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
        const particleCount = 100; // Increased density for better plexus

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.4, // Slightly faster base movement
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 0.5,
                pulse: Math.random() * Math.PI,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    drawHexGrid() {
        this.gCtx.clearRect(0, 0, this.width, this.height);

        const size = 60;
        const h = size * Math.sqrt(3);
        const w = size * 2;

        this.gCtx.strokeStyle = '#4ed9ff';
        this.gCtx.lineWidth = 1;

        for (let y = -h; y < this.height + h; y += h * 0.86) {
            for (let x = -w; x < this.width + w; x += w * 0.75) {
                const xOff = (Math.floor(y / (h * 0.86)) % 2) * (w * 0.375);
                const cx = x + xOff;
                const cy = y;

                const dist = Math.sqrt((this.mouse.x - cx) ** 2 + (this.mouse.y - cy) ** 2);
                const opacity = Math.max(0.05, 0.4 - dist / 600);
                this.gCtx.globalAlpha = opacity;

                if (opacity > 0.06) { // Optimization
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
    }

    drawParticles() {
        this.pCtx.clearRect(0, 0, this.width, this.height);

        const connectionDist = 160;
        const mouseDist = 200;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // 1. Update Position
            p.x += p.vx;
            p.y += p.vy;

            // 2. Mouse Magnetism
            const dxm = this.mouse.x - p.x;
            const dym = this.mouse.y - p.y;
            const distM = Math.sqrt(dxm * dxm + dym * dym);

            if (distM < mouseDist) {
                const force = (mouseDist - distM) / mouseDist;
                p.x += dxm * force * 0.02; // Gentle pull
                p.y += dym * force * 0.02;

                // Mouse to Particle Connection
                this.pCtx.beginPath();
                this.pCtx.strokeStyle = '#4ed9ff';
                this.pCtx.lineWidth = 0.5 * force;
                this.pCtx.globalAlpha = force * 0.3;
                this.pCtx.moveTo(p.x, p.y);
                this.pCtx.lineTo(this.mouse.x, this.mouse.y);
                this.pCtx.stroke();
            }

            // 3. Screen Bounce
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // 4. Connect to other particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;

                if (distSq < connectionDist * connectionDist) {
                    const dist = Math.sqrt(distSq);
                    const force = 1 - dist / connectionDist;
                    this.pCtx.beginPath();
                    this.pCtx.strokeStyle = '#4ed9ff';
                    this.pCtx.lineWidth = force * 0.8;
                    this.pCtx.globalAlpha = force * 0.25;
                    this.pCtx.moveTo(p.x, p.y);
                    this.pCtx.lineTo(p2.x, p2.y);
                    this.pCtx.stroke();
                }
            }

            // 5. Draw Particle
            p.pulse += p.pulseSpeed;
            const pulseScale = 0.8 + Math.sin(p.pulse) * 0.2;

            this.pCtx.fillStyle = '#4ed9ff';
            this.pCtx.globalAlpha = 0.5 + (distM < mouseDist ? 0.3 : 0);
            this.pCtx.beginPath();
            this.pCtx.arc(p.x, p.y, p.size * pulseScale, 0, Math.PI * 2);
            this.pCtx.fill();

            // Add inner core for larger particles
            if (p.size > 1.5) {
                this.pCtx.fillStyle = '#fff';
                this.pCtx.globalAlpha = 0.8;
                this.pCtx.beginPath();
                this.pCtx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
                this.pCtx.fill();
            }
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
    // Initialize preloader early
    initPreloader();

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
    initRevealAnimations,
    initPreloader
};
