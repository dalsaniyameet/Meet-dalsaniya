/* =============================================
   MEET DALSANIYA - 3D PORTFOLIO
   script.js - Full Interactivity & Animations
   ============================================= */

'use strict';

/* ====================================
   1. PRELOADER
   ==================================== */
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
        document.body.style.overflow = 'visible';
        // Start animations after preloader
        initAllAnimations();
    }, 1800);
});

document.body.style.overflow = 'hidden';

function initAllAnimations() {
    initTypingEffect();
    initCounters();
    initScrollReveal();
    initSkillBars();
    initTimelineReveal();
    initParticleCanvas();
    initTiltEffect();
    initNavHighlight();
}

/* ====================================
   2. CUSTOM CURSOR
   ==================================== */
const cursor       = document.querySelector('.cursor');
const cursorFollow = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followX = 0, followY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
});

// Smooth follower
function animateCursor() {
    followX += (mouseX - followX) * 0.12;
    followY += (mouseY - followY) * 0.12;
    cursorFollow.style.left = followX + 'px';
    cursorFollow.style.top  = followY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll(
    'a, button, .btn, .project-card, .skill-category-card, .stat-card, .cert-card, .tool-badge, input, textarea'
);
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollow.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollow.classList.remove('hover');
    });
});

/* ====================================
   3. NAVBAR
   ==================================== */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.querySelector('.nav-links');
const navItems   = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
    }
});

// Close menu on nav link click
navItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
    });
});

/* ====================================
   4. ACTIVE NAV LINK ON SCROLL
   ==================================== */
function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => observer.observe(section));
}

/* ====================================
   5. HERO PARTICLE CANVAS
   ==================================== */
function initParticleCanvas() {
    const canvas  = document.getElementById('heroCanvas');
    const ctx     = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
        width  = canvas.width  = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); createParticles(); });

    // Mouse position for interaction
    let mx = width / 2, my = height / 2;
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
    });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x    = Math.random() * width;
            this.y    = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.alpha = Math.random() * 0.3 + 0.05;
            this.color = Math.random() > 0.6
                ? `rgba(124, 58, 237, ${this.alpha})`
                : `rgba(8, 145, 178, ${this.alpha})`;
            this.originalX = this.x;
            this.originalY = this.y;
        }
        update() {
            // Mouse repel
            const dx   = mx - this.x;
            const dy   = my - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x -= dx * force * 0.04;
                this.y -= dy * force * 0.04;
            } else {
                this.x += (this.originalX - this.x) * 0.02;
                this.y += (this.originalY - this.y) * 0.02;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            this.originalX += this.speedX;
            this.originalY += this.speedY;

            if (this.originalX < 0) this.originalX = width;
            if (this.originalX > width) this.originalX = 0;
            if (this.originalY < 0) this.originalY = height;
            if (this.originalY > height) this.originalY = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createParticles() {
        const count = Math.floor((width * height) / 9000);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    createParticles();

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx   = particles[i].x - particles[j].x;
                const dy   = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const alpha = (1 - dist / 100) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
                    ctx.lineWidth   = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Floating geometric shapes
    const shapes = [];
    for (let i = 0; i < 6; i++) {
        shapes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 40 + 20,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 0.01,
            alpha: Math.random() * 0.06 + 0.02,
            type: Math.floor(Math.random() * 3) // 0=triangle, 1=square, 2=hex
        });
    }

    function drawShape(s) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.strokeStyle = `rgba(124, 58, 237, ${s.alpha})`;
        ctx.lineWidth   = 1;
        ctx.beginPath();
        if (s.type === 0) {
            // Triangle
            ctx.moveTo(0, -s.size);
            ctx.lineTo(s.size * 0.866, s.size * 0.5);
            ctx.lineTo(-s.size * 0.866, s.size * 0.5);
            ctx.closePath();
        } else if (s.type === 1) {
            // Square
            ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
        } else {
            // Hexagon
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const hx    = s.size * Math.cos(angle);
                const hy    = s.size * Math.sin(angle);
                i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
            }
            ctx.closePath();
        }
        ctx.stroke();
        ctx.restore();

        s.x        += s.speedX;
        s.y        += s.speedY;
        s.rotation += s.rotSpeed;
        if (s.x < -100) s.x = width + 100;
        if (s.x > width + 100) s.x = -100;
        if (s.y < -100) s.y = height + 100;
        if (s.y > height + 100) s.y = -100;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        shapes.forEach(s => drawShape(s));
        requestAnimationFrame(animate);
    }
    animate();
}

/* ====================================
   6. TYPING EFFECT
   ==================================== */
function initTypingEffect() {
    const el     = document.getElementById('typedText');
    const texts  = [
        'SEO Analyst',
        'On-Page SEO Specialist',
        'Off-Page SEO Expert',
        'Keyword Research Pro',
        'Digital Marketing Expert',
        'WordPress Developer',
        'CRM Builder',
        'Web Deployment Specialist'
    ];

    let textIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;
    let delay      = 120;

    function type() {
        const current = texts[textIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            delay = 60;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            delay = 120;
        }

        if (!isDeleting && charIndex === current.length) {
            delay      = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex  = (textIndex + 1) % texts.length;
            delay      = 400;
        }
        setTimeout(type, delay);
    }
    type();
}

/* ====================================
   7. COUNTER ANIMATION
   ==================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-num');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target  = parseInt(entry.target.dataset.count);
                const duration = 2000;
                const step     = target / (duration / 16);
                let current    = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = Math.floor(current);
                }, 16);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

/* ====================================
   8. SKILL BARS
   ==================================== */
function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill  = entry.target;
                const width = fill.dataset.width;
                setTimeout(() => {
                    fill.style.width = width + '%';
                }, 200);
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    fills.forEach(f => observer.observe(f));
}

/* ====================================
   9. SCROLL REVEAL
   ==================================== */
function initScrollReveal() {
    // Add reveal class to sections
    const revealElements = document.querySelectorAll(
        '.section-header, .skill-category-card, .project-card, .cert-card, .contact-info, .contact-form, .tools-section, .certs-section'
    );

    revealElements.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
}

/* ====================================
   10. TIMELINE REVEAL
   ==================================== */
function initTimelineReveal() {
    const items = document.querySelectorAll('.timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    items.forEach(item => observer.observe(item));
}

/* ====================================
   11. 3D TILT EFFECT
   ==================================== */
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect   = card.getBoundingClientRect();
            const x      = e.clientX - rect.left;
            const y      = e.clientY - rect.top;
            const centerX = rect.width  / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) *  10;

            card.style.transform = `
                perspective(800px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(20px)
                scale3d(1.02, 1.02, 1.02)
            `;
            card.style.transition = 'transform 0.1s ease';

            // Dynamic glow position
            const glow = card.querySelector('.project-glow');
            if (glow) {
                glow.style.left = x - 100 + 'px';
                glow.style.top  = y - 100 + 'px';
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform 0.5s ease';
            const glow = card.querySelector('.project-glow');
            if (glow) glow.style.opacity = '0';
        });
    });
}

/* ====================================
   12. HERO 3D CARD TILT
   ==================================== */
const card3d = document.getElementById('card3d');
if (card3d) {
    card3d.addEventListener('mousemove', (e) => {
        const rect    = card3d.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const centerX = rect.width  / 2;
        const centerY = rect.height / 2;
        const rotX    = ((y - centerY) / centerY) * -15;
        const rotY    = ((x - centerX) / centerX) *  15;

        card3d.style.transform  = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
        card3d.style.transition = 'transform 0.1s ease';
    });

    card3d.addEventListener('mouseleave', () => {
        card3d.style.transform  = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
        card3d.style.transition = 'transform 0.6s ease';
    });
}

/* ====================================
   13. SMOOTH SCROLL
   ==================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ====================================
   14. CONTACT FORM
   ==================================== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn  = contactForm.querySelector('.btn-primary');
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');

        // Sending state
        span.textContent     = 'Sending...';
        icon.className       = 'fas fa-spinner fa-spin';
        btn.style.background = 'linear-gradient(135deg, #475569, #334155)';
        btn.disabled         = true;

        setTimeout(() => {
            // Success state
            span.textContent     = 'Message Sent!';
            icon.className       = 'fas fa-check';
            btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
            btn.style.boxShadow  = '0 8px 30px rgba(16, 185, 129, 0.4)';

            // Reset form
            contactForm.reset();

            // Reset button after 3s
            setTimeout(() => {
                span.textContent     = 'Send Message';
                icon.className       = 'fas fa-paper-plane';
                btn.style.background = '';
                btn.style.boxShadow  = '';
                btn.disabled         = false;
            }, 3000);
        }, 1800);
    });
}

/* ====================================
   15. FLOATING ABOUT SECTION PARALLAX
   ==================================== */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Subtle parallax on hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    }

    // Stats glow pulse on hero
    const stats = document.querySelectorAll('.stat-card');
    stats.forEach((card, i) => {
        const offset = Math.sin(scrollY * 0.01 + i) * 5;
        card.style.transform = `translateY(${offset}px)`;
    });
});

/* ====================================
   16. ORBIT DOTS ICON ANIMATION
   ==================================== */
// Keep orbit dots always counter-rotating so icon stays upright
const orbitDots = document.querySelectorAll('.orbit-dot');
orbitDots.forEach(dot => {
    // Already handled by CSS counter-spin animation
    // Add hover tooltip
    const icons = dot.querySelectorAll('i');
    icons.forEach(icon => {
        icon.style.fontSize = '1rem';
    });
});

/* ====================================
   17. MARQUEE PAUSE ON HOVER
   ==================================== */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
    });
}

/* Section background gradients disabled for light theme */

/* ====================================
   19. GLITCH TEXT EFFECT (Hero name)
   ==================================== */
const heroTitleLines = document.querySelectorAll('.title-line');
heroTitleLines.forEach(line => {
    line.addEventListener('mouseenter', () => {
        line.style.animation = 'none';
        line.style.letterSpacing = '4px';
        line.style.transition = 'letter-spacing 0.3s ease';
        setTimeout(() => {
            line.style.letterSpacing = '';
        }, 300);
    });
});

/* ====================================
   20. BACK TO TOP (on logo click)
   ==================================== */
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
    navLogo.style.cursor = 'none';
    navLogo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ====================================
   21. STAR FIELD EASTER EGG
   (Triple click on name)
   ==================================== */
let clickCount = 0;
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 3) {
            clickCount = 0;
            launchStars();
        }
    });
}

function launchStars() {
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: hsl(${Math.random() * 360}, 100%, 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: 50%;
            top: 40%;
            animation: starBurst 1s ease-out forwards;
            --dx: ${(Math.random() - 0.5) * 400}px;
            --dy: ${(Math.random() - 0.5) * 400 - 100}px;
        `;
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }

    // Inject keyframes if not already done
    if (!document.getElementById('starBurstStyle')) {
        const style = document.createElement('style');
        style.id = 'starBurstStyle';
        style.textContent = `
            @keyframes starBurst {
                0%   { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ====================================
   22. PERFORMANCE: Pause canvas on
       tab inactive
   ==================================== */
let canvasPaused = false;
document.addEventListener('visibilitychange', () => {
    canvasPaused = document.hidden;
});

/* ====================================
   23. INIT LOG
   ==================================== */
console.log('%c M.D Portfolio Loaded ', 
    'background: linear-gradient(135deg, #7c3aed, #06b6d4); color: white; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
);
console.log('%c Meet Dalsaniya | SEO Analyst & Digital Marketing Expert',
    'color: #a78bfa; font-size: 11px;'
);
