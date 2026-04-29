// ====================================================================================
// PORTFOLIO JAVASCRIPT
// Northern Lights Animation + Theme Toggle + All Interactions
// ====================================================================================

// ========== NORTHERN LIGHTS CANVAS ANIMATION ==========
class NorthernLights {
    constructor() {
        this.canvas = document.getElementById('aurora-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.animationFrame = null;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        // Create 3 gentle aurora waves
        this.waves = [
            {
                y: this.canvas.height * 0.3,
                amplitude: 40,
                frequency: 0.02,
                speed: 0.0015,
                offset: 0,
                color: { r: 16, g: 185, b: 129, a: 0.15 } // #10b981
            },
            {
                y: this.canvas.height * 0.5,
                amplitude: 60,
                frequency: 0.015,
                speed: 0.001,
                offset: Math.PI / 2,
                color: { r: 20, g: 184, b: 166, a: 0.12 } // #14b8a6
            },
            {
                y: this.canvas.height * 0.7,
                amplitude: 50,
                frequency: 0.018,
                speed: 0.0012,
                offset: Math.PI,
                color: { r: 52, g: 211, b: 153, a: 0.1 } // #34d399
            }
        ];
    }
    
    drawWave(wave) {
        this.ctx.beginPath();
        
        // Start from left edge
        this.ctx.moveTo(0, this.canvas.height);
        
        // Draw wave curve
        for (let x = 0; x <= this.canvas.width; x += 10) {
            const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
            this.ctx.lineTo(x, y);
        }
        
        // Complete the shape
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.closePath();
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, this.canvas.height);
        gradient.addColorStop(0, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.color.a})`);
        gradient.addColorStop(1, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw each wave
        this.waves.forEach(wave => {
            wave.offset += wave.speed;
            this.drawWave(wave);
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Initialize Northern Lights
let northernLights = null;

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
        northernLights = new NorthernLights();
    }
});

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Set initial theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Handle Northern Lights
    if (newTheme === 'dark') {
        if (!northernLights) {
            northernLights = new NorthernLights();
        }
    } else {
        if (northernLights) {
            northernLights.destroy();
            northernLights = null;
        }
    }
});

// ========== NAVIGATION SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========== SMOOTH SCROLL FOR NAVIGATION LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll('.counter');

const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
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
            observer.unobserve(counter);
        }
    });
};

const counterObserver = new IntersectionObserver(animateCounters, { 
    threshold: 0.5 
});

counters.forEach(counter => counterObserver.observe(counter));

// ========== SCROLL REVEAL ANIMATION ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.card, .skill-category, .timeline-item, .project-card, .cert-card, .info-card'
    );
    
    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        fadeInObserver.observe(el);
    });
});

// ========== EMAILJS INTEGRATION ==========
(function () {
    emailjs.init('5CuD7K8DVxPtGN4Va');
})();

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const button = contactForm.querySelector('button[type="submit"]');
    
    const showFormMessage = (text, isSuccess) => {
        let msg = contactForm.querySelector('.form-msg');
        
        if (!msg) {
            msg = document.createElement('div');
            msg.className = 'form-msg';
            msg.style.marginTop = '16px';
            msg.style.padding = '12px 20px';
            msg.style.borderRadius = '12px';
            msg.style.textAlign = 'center';
            msg.style.fontWeight = '500';
            contactForm.appendChild(msg);
        }
        
        msg.textContent = text;
        
        if (isSuccess) {
            msg.style.background = 'rgba(16, 185, 129, 0.1)';
            msg.style.color = '#10b981';
            msg.style.border = '1px solid #10b981';
        } else {
            msg.style.background = 'rgba(239, 68, 68, 0.1)';
            msg.style.color = '#ef4444';
            msg.style.border = '1px solid #ef4444';
        }
    };
    
    const clearErrors = () => {
        document.querySelectorAll('.error').forEach((el) => el.remove());
    };
    
    const showError = (input, message) => {
        let errorSpan = input.parentNode.querySelector('.error');
        
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error';
            errorSpan.style.color = '#ef4444';
            errorSpan.style.fontSize = '0.85rem';
            errorSpan.style.marginTop = '6px';
            errorSpan.style.display = 'block';
            input.parentNode.appendChild(errorSpan);
        }
        
        errorSpan.textContent = message;
    };
    
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();
        
        const name = contactForm.querySelector('[name="name"]');
        const email = contactForm.querySelector('[name="email"]');
        const message = contactForm.querySelector('[name="message"]');
        
        let isValid = true;
        
        // Validation
        if (!name.value.trim()) {
            showError(name, 'Name is required.');
            isValid = false;
        }
        
        if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
            showError(email, 'Enter a valid email.');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            showError(message, 'Message cannot be empty.');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Send email
        button.disabled = true;
        button.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
        
        emailjs.sendForm('service_dhlqq6e', 'template_8ri1x28', contactForm)
            .then(() => {
                showFormMessage('✓ Message sent successfully!', true);
                contactForm.reset();
                button.disabled = false;
                button.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
            })
            .catch((error) => {
                showFormMessage('✗ Something went wrong. Please try again.', false);
                button.disabled = false;
                button.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                console.error('EmailJS Error:', error);
            });
    });
}

// ========== PAGE LOAD ANIMATION ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🌌 Portfolio Loaded - Dark: Northern Lights | Light: Navy Blue');