// ====================================================================================
// NAVY + WHITE PARALLAX PORTFOLIO - JAVASCRIPT
// Parallax Scrolling + Counter Animations + EmailJS
// ====================================================================================

// ========== PARALLAX SCROLLING ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax layers - different speeds
    const layer1 = document.querySelector('.layer-1');
    const layer2 = document.querySelector('.layer-2');
    const layer3 = document.querySelector('.layer-3');
    
    if (layer1) layer1.style.transform = `translateY(${scrolled * 0.3}px)`;
    if (layer2) layer2.style.transform = `translateY(${scrolled * 0.5}px)`;
    if (layer3) layer3.style.transform = `translateY(${scrolled * 0.8}px)`;
}, { passive: true });

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

// ========== COUNTER ANIMATION ==========
const counters = document.querySelectorAll('.counter');

const animateCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
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

// ========== SMOOTH SCROLL FOR NAVIGATION LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

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
        '.about-card, .skill-category, .timeline-item, .project-card, .cert-card, .info-card'
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
    emailjs.init('5CuD7K8DVxPtGN4Va'); // Your EmailJS User ID
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
        msg.style.background = isSuccess ? 'rgba(10, 25, 41, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        msg.style.color = isSuccess ? '#0a1929' : '#ef4444';
        msg.style.border = isSuccess ? '1px solid #0a1929' : '1px solid #ef4444';
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

console.log('🚀 Navy + White Parallax Portfolio Loaded!');