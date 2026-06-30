// PORTFOLIO JAVASCRIPT - ALL FEATURES + NORTHERN LIGHTS + NEW ANIMATIONS

// ============================================
// NORTHERN LIGHTS ANIMATION
// ============================================
class NorthernLights {
    constructor() {
        this.canvas = document.getElementById('aurora-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.time = 0;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.waves = [
            {
                color: 'rgba(217, 133, 82, 0.25)',
                amplitude: 50,
                frequency: 0.015,
                speed: 0.001,
                offset: 0
            },
            {
                color: 'rgba(184, 92, 56, 0.2)',
                amplitude: 40,
                frequency: 0.018,
                speed: 0.0012,
                offset: Math.PI / 3
            },
            {
                color: 'rgba(232, 168, 124, 0.18)',
                amplitude: 35,
                frequency: 0.02,
                speed: 0.0015,
                offset: Math.PI / 1.5
            }
        ];

        this.animate();
    }

    resize() {
        const hero = document.querySelector('.hero');
        const rect = hero ? hero.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    drawWave(wave) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);

        for (let x = 0; x <= this.canvas.width; x += 5) {
            const y = this.canvas.height * 0.3 +
                     Math.sin(x * wave.frequency + this.time + wave.offset) * wave.amplitude;
            this.ctx.lineTo(x, y);
        }

        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.closePath();

        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.5);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(0.5, wave.color.replace(/[\d.]+\)/, '0.2)'));
        gradient.addColorStop(1, 'rgba(217, 133, 82, 0)');

        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.waves.forEach(wave => {
            this.drawWave(wave);
            wave.offset += wave.speed;
        });

        this.time += 0.005;
        requestAnimationFrame(() => this.animate());
    }
}

let northernLights;
if (document.getElementById('aurora-canvas')) {
    northernLights = new NorthernLights();
}

// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section, .hero');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// COUNTER ANIMATION
// ============================================
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target;
        }
    };

    updateCounter();
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
const revealElements = document.querySelectorAll('.card, .project-card, .cert-card, .timeline-item');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
    revealObserver.observe(element);
});

// ============================================
// NEW: TYPING ANIMATION FOR HERO SUBTITLE
// ============================================
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const fullText = subtitle.textContent.trim();
    subtitle.textContent = '';

    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'typed-cursor';
    cursorSpan.textContent = '\u00A0';

    let i = 0;
    function type() {
        if (i <= fullText.length) {
            subtitle.textContent = fullText.slice(0, i);
            subtitle.appendChild(cursorSpan);
            i++;
            setTimeout(type, 45);
        } else {
            setTimeout(() => cursorSpan.remove(), 1200);
        }
    }
    setTimeout(type, 600);
}
initTypingEffect();

// ============================================
// NEW: TILT EFFECT ON PROJECT CARDS
// ============================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');
    const maxTilt = 8;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -maxTilt;
            const rotateY = ((x - centerX) / centerX) * maxTilt;

            card.style.transform =
                `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
initTiltEffect();

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// EMAIL JS - CONTACT FORM
// ============================================
emailjs.init('h-u2vGGgRkBRbnSiV'); // Your EmailJS public key

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.btn-primary');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    try {
        await emailjs.sendForm(
            'service_dhlqq6e',
            'template_8ri1x28',
            contactForm
        );

        submitBtn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
        submitBtn.style.background = '#10b981';

        contactForm.reset();

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);

    } catch (error) {
        console.error('Email send error:', error);

        submitBtn.innerHTML = '<span>Failed to Send</span> <i class="fas fa-times"></i>';
        submitBtn.style.background = '#ef4444';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
});

// ============================================
// CURSOR EFFECT
// ============================================
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// ============================================
// PARALLAX EFFECT ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');

    if (heroLeft) {
        heroLeft.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    if (heroRight) {
        heroRight.style.transform = `translateY(${scrolled * -0.1}px)`;
    }
});

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    setTimeout(() => {
        document.querySelectorAll('.hero-left, .hero-right').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        });
    }, 100);
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%c👋 Hey there!', 'font-size: 24px; color: #10b981; font-weight: bold;');
console.log('%cLooking at the code? I like your style! 😎', 'font-size: 14px; color: #10b981;');
console.log('%cFeel free to reach out: Koushikshet2401@gmail.com', 'font-size: 12px; color: #64748b;');

console.log('%c🎨 Built with: HTML, CSS, JavaScript', 'font-size: 12px; color: #10b981;');
console.log('%c🌌 Northern Lights animation: Custom Canvas API', 'font-size: 12px; color: #10b981;');
console.log('%c⚡ Dual Theme System: CSS Variables + LocalStorage', 'font-size: 12px; color: #10b981;');