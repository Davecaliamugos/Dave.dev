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
function initPreloader(customMessage, startProgress = 0) {
    // 1. Check Internet Status
    const isOffline = !navigator.onLine;
    const defaultText = isOffline ? 'OFFLINE // RETRYING' : (customMessage || 'CONNECTING');

    // 2. Create or Update Preloader
    let preloader = document.querySelector('.preloader');
    if (!preloader) {
        preloader = document.createElement('div');
        preloader.className = 'preloader';
        preloader.innerHTML = `
            <div class="loader-content">
                <div class="loader-bar-container">
                    <div class="loader-bar" id="loaderBar"></div>
                </div>
                <div class="loader-status">
                    <span class="loader-text" id="loaderText">${defaultText}</span>
                    <span id="load-percentage">0%</span>
                </div>
            </div>
        `;
        document.body.prepend(preloader);
    }

    const percElement = document.getElementById('load-percentage');
    const barElement = document.getElementById('loaderBar');
    let progress = startProgress;

    // Reset/Set initial state
    if (percElement) percElement.innerText = Math.floor(progress) + '%';
    if (barElement) barElement.style.width = progress + '%';

    // 3. Animation Logic
    const interval = setInterval(() => {
        // If offline, slow down or pause at 99%
        if (!navigator.onLine) {
            progress += Math.random() * 0.5;
            if (progress > 99) progress = 99;
        } else {
            // Slower increment if we started midway to avoid "blinking"
            const step = startProgress > 0 ? 5 : 10;
            progress += Math.floor(Math.random() * step) + 2;
        }

        if (progress > 100) progress = 100;

        if (percElement) percElement.innerText = Math.floor(progress) + '%';
        if (barElement) barElement.style.width = progress + '%';

        if (progress >= 100 && navigator.onLine) {
            clearInterval(interval);
            finishLoading();
        }
    }, 120);

    const finishLoading = () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            if (preloader.parentNode) preloader.remove();
        }, 800);
    };

    // 4. Listen for Online Status Recover
    window.addEventListener('online', () => {
        const textElement = document.getElementById('loaderText');
        if (textElement) textElement.innerText = 'CONNECTION RESTORED';
    });
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

    // 4. Dynamic Page Transitions
    navLinksContainer.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            const targetTitle = link.innerText;

            // Only trigger if it's an internal link and not the same page
            if (targetUrl && !targetUrl.startsWith('http') && targetUrl !== currentPage) {
                e.preventDefault();

                // Set transition state
                sessionStorage.setItem('isNavigating', 'true');

                // Show minimal overlay immediately
                const preloader = document.createElement('div');
                preloader.className = 'preloader';
                preloader.innerHTML = `<div class="loader-content"><div class="loader-status"><span class="loader-text">REDIRECTING...</span></div></div>`;
                document.body.prepend(preloader);

                // Small delay for the animation to be seen
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 300);
            }

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

    // Show custom cursor even on touch devices
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Hide default cursor globally
    document.body.style.cursor = 'none';

    const updateCursor = (x, y) => {
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        ring.style.left = x + 'px';
        ring.style.top = y + 'px';
    };

    window.addEventListener('mousemove', (e) => {
        updateCursor(e.clientX, e.clientY);
    });

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            updateCursor(e.touches[0].clientX, e.touches[0].clientY);
            dot.style.opacity = '1';
            ring.style.opacity = '1';
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            updateCursor(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });
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
        this.isMobile = false;
        this.mouse = { x: 0, y: 0, active: false };
        this.particles = [];
        this.time = 0;

        this.init();
    }

    init() {
        this.resize();

        // Add spotlight element
        this.spotlight = document.createElement('div');
        this.spotlight.className = 'spotlight-bg';
        this.spotlight.style.background = 'radial-gradient(circle at center, rgba(78, 217, 255, 0.08) 0%, transparent 70%)';
        document.body.prepend(this.spotlight);

        window.addEventListener('resize', () => this.resize());

        const handleInteraction = (x, y) => {
            this.mouse.x = x;
            this.mouse.y = y;
            this.mouse.active = true;

            // Move spotlight
            this.spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(78, 217, 255, ${this.isMobile ? 0.15 : 0.12}) 0%, transparent 50%)`;
        };

        window.addEventListener('mousemove', (e) => handleInteraction(e.clientX, e.clientY));

        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        // Deactivate interaction after some time on touch
        window.addEventListener('touchend', () => {
            setTimeout(() => { this.mouse.active = false; }, 3000);
        });

        this.animate();
    }

    resize() {
        this.width = this.pCanvas.width = this.gCanvas.width = window.innerWidth;
        this.height = this.pCanvas.height = this.gCanvas.height = window.innerHeight;
        this.isMobile = this.width < 768;
        this.initParticles();
    }

    initParticles() {
        this.particles = [];
        const particleCount = this.isMobile ? 75 : 150; // Grand density

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * (this.isMobile ? 0.35 : 0.5),
                vy: (Math.random() - 0.5) * (this.isMobile ? 0.35 : 0.5),
                size: Math.random() * (this.isMobile ? 3 : 4.5) + 1.2, // Even bigger particles
                pulse: Math.random() * Math.PI,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    drawHexGrid() {
        this.gCtx.clearRect(0, 0, this.width, this.height);

        const size = this.isMobile ? 60 : 80; // Larger hexagons
        const h = size * Math.sqrt(3);
        const w = size * 2;

        this.gCtx.strokeStyle = '#4ed9ff';
        this.gCtx.lineWidth = this.isMobile ? 2 : 2.5; // Bolder lines

        for (let y = -h; y < this.height + h; y += h * 0.86) {
            for (let x = -w; x < this.width + w; x += w * 0.75) {
                const xOff = (Math.floor(y / (h * 0.86)) % 2) * (w * 0.375);
                const cx = x + xOff;
                const cy = y;

                const dist = Math.sqrt((this.mouse.x - cx) ** 2 + (this.mouse.y - cy) ** 2);
                const opacity = Math.max(0.06, (this.isMobile ? 0.3 : 0.4) - dist / (this.isMobile ? 500 : 800)); // Subtler grid
                this.gCtx.globalAlpha = opacity;

                if (opacity > 0.12) {
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

        const connectionDist = this.isMobile ? 180 : 260; // Huge connections
        const mouseDist = this.isMobile ? 200 : 320;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;

            const dxm = this.mouse.x - p.x;
            const dym = this.mouse.y - p.y;
            const distM = Math.sqrt(dxm * dxm + dym * dym);

            if (distM < mouseDist) {
                const force = (mouseDist - distM) / mouseDist;
                p.x += dxm * force * 0.02;
                p.y += dym * force * 0.02;

                this.pCtx.beginPath();
                this.pCtx.strokeStyle = '#4ed9ff';
                this.pCtx.lineWidth = 0.5 * force;
                this.pCtx.globalAlpha = force * 0.3;
                this.pCtx.moveTo(p.x, p.y);
                this.pCtx.lineTo(this.mouse.x, this.mouse.y);
                this.pCtx.stroke();
            }

            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

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
                    this.pCtx.lineWidth = force * (this.isMobile ? 1.2 : 1.5);
                    this.pCtx.globalAlpha = force * 0.25; // Less distracting lines
                    this.pCtx.moveTo(p.x, p.y);
                    this.pCtx.lineTo(p2.x, p2.y);
                    this.pCtx.stroke();
                }
            }

            p.pulse += p.pulseSpeed;
            const pulseScale = 0.8 + Math.sin(p.pulse) * 0.2;

            this.pCtx.fillStyle = '#4ed9ff';
            this.pCtx.globalAlpha = 0.5 + (distM < mouseDist ? 0.3 : 0);
            this.pCtx.beginPath();
            this.pCtx.arc(p.x, p.y, p.size * pulseScale, 0, Math.PI * 2);
            this.pCtx.fill();

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
        this.time += 0.005;

        // Auto-drift if no interaction
        if (!this.mouse.active) {
            this.mouse.x = this.width / 2 + Math.sin(this.time) * (this.width * 0.35);
            this.mouse.y = this.height / 2 + Math.cos(this.time * 0.7) * (this.height * 0.25);

            if (this.spotlight) {
                this.spotlight.style.background = `radial-gradient(circle at ${this.mouse.x}px ${this.mouse.y}px, rgba(78, 217, 255, 0.05) 0%, transparent 60%)`;
            }
        }

        this.drawHexGrid();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if we just navigated from the menu
    const wasNavigating = sessionStorage.getItem('isNavigating');
    if (wasNavigating) {
        initPreloader('Connecting', 40); // Start from 40% for a "connected" feel
        sessionStorage.removeItem('isNavigating');
    } else {
        initPreloader();
    }

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
