// PORTFOLIO JAVASCRIPT - ALL FEATURES + BETTER NORTHERN LIGHTS

// ============================================
// NORTHERN LIGHTS ANIMATION - MORE VISIBLE & REALISTIC
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
        
        // Create 3 aurora waves with BETTER visibility
        this.waves = [
            {
                color: 'rgba(16, 185, 129, 0.4)',  // Green - MORE OPACITY
                amplitude: 60,
                frequency: 0.015,
                speed: 0.001,
                offset: 0
            },
            {
                color: 'rgba(20, 184, 166, 0.35)',  // Teal - MORE OPACITY
                amplitude: 50,
                frequency: 0.018,
                speed: 0.0012,
                offset: Math.PI / 3
            },
            {
                color: 'rgba(52, 211, 153, 0.3)',  // Light Green - MORE OPACITY
                amplitude: 40,
                frequency: 0.02,
                speed: 0.0015,
                offset: Math.PI / 1.5
            }
        ];
        
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawWave(wave) {
        this.ctx.beginPath();
        
        // Start from top
        this.ctx.moveTo(0, 0);
        
        // Draw wave path
        for (let x = 0; x <= this.canvas.width; x += 5) {
            const y = this.canvas.height * 0.3 + 
                     Math.sin(x * wave.frequency + this.time + wave.offset) * wave.amplitude;
            this.ctx.lineTo(x, y);
        }
        
        // Complete the path to create fill area
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.closePath();
        
        // Create gradient for MORE realistic aurora effect
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.5);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(0.5, wave.color.replace(/[\d.]+\)/, '0.2)'));  // Fade middle
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');  // Transparent bottom
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all waves
        this.waves.forEach(wave => {
            this.drawWave(wave);
            wave.offset += wave.speed;
        });
        
        this.time += 0.005;
        
        // 60fps animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Northern Lights
let northernLights;
if (document.getElementById('aurora-canvas')) {
    northernLights = new NorthernLights();
}

// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// Function to update project images based on theme
function updateProjectImages(theme) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const img = card.querySelector('.project-screenshot');
        if (img) {
            const lightImg = card.getAttribute('data-light-img');
            const darkImg = card.getAttribute('data-dark-img');
            
            // Fade out
            img.style.opacity = '0';
            
            // Wait for fade out, then switch image
            setTimeout(() => {
                if (theme === 'light') {
                    img.src = lightImg;
                } else {
                    img.src = darkImg;
                }
                // Fade in
                img.style.opacity = '1';
            }, 300);
        }
    });
}

// Update images on initial load
updateProjectImages(savedTheme);

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update project images
    updateProjectImages(newTheme);
});

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section, .hero');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
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

// Intersection Observer for counters
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
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    try {
        // Send email using EmailJS
        await emailjs.sendForm(
            'service_dhlqq6e',  // Your service ID
            'template_8ri1x28', // Your template ID
            contactForm
        );
        
        // Success state
        submitBtn.innerHTML = '<span>Sent Successfully!</span> <i class="fas fa-check"></i>';
        submitBtn.style.background = '#10b981';
        
        // Reset form
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
        
    } catch (error) {
        console.error('Email send error:', error);
        
        // Error state
        submitBtn.innerHTML = '<span>Failed to Send</span> <i class="fas fa-times"></i>';
        submitBtn.style.background = '#ef4444';
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
});

// ============================================
// CURSOR EFFECT (Optional Enhancement)
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

// Add hover effects to interactive elements
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
    
    // Parallax for hero content
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
    
    // Add entrance animations
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