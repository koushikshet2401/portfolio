// ====================================================================================
// ULTRA MODERN PORTFOLIO 2026 - BRIGHT ANIMATIONS + SMOOTH SCROLL
// ====================================================================================

// ========== LENIS SMOOTH SCROLL (ALL DEVICES) ==========
const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    wheelMultiplier: 1.2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ========== THREE.JS BRIGHT ANIMATIONS (OPTIMIZED) ==========
let renderer, scene, camera, particlesMesh, shapes;
let animationPaused = false;
let currentTheme = savedTheme;

function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: false,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // BRIGHT particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth > 768 ? 250 : 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.12,
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
    });

    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // BRIGHT shapes
    const geometries = [
        new THREE.TetrahedronGeometry(0.9),
        new THREE.OctahedronGeometry(0.9),
        new THREE.IcosahedronGeometry(0.9),
    ];

    shapes = [];
    for (let i = 0; i < 8; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        let shapeColor = currentTheme === 'dark' ? 0xfbbf24 : 0x6366f1;
        
        const material = new THREE.MeshBasicMaterial({
            color: shapeColor,
            wireframe: true,
            transparent: true,
            opacity: 0.3,
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 20
        );
        shapes.push({
            mesh: mesh,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.008,
                y: (Math.random() - 0.5) * 0.008,
            }
        });
        scene.add(mesh);
    }

    // Update colors on theme change
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            currentTheme = html.getAttribute('data-theme');
            const newColor = currentTheme === 'dark' ? 0xfbbf24 : 0x6366f1;
            shapes.forEach(shape => {
                shape.mesh.material.color.setHex(newColor);
            });
        }, 100);
    });

    // Mouse
    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) * 2 - 1;
        targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Animation - 45fps cap
    const clock = new THREE.Clock();
    let lastTime = 0;
    const frameDelay = 1000 / 45;

    function animate(currentTime) {
        requestAnimationFrame(animate);

        if (currentTime - lastTime < frameDelay) return;
        lastTime = currentTime;

        if (animationPaused) return;

        const elapsedTime = clock.getElapsedTime();

        mouseX += (targetX - mouseX) * 0.03;
        mouseY += (targetY - mouseY) * 0.03;

        particlesMesh.rotation.y = elapsedTime * 0.04;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.06) * 0.15;

        shapes.forEach((shape) => {
            shape.mesh.rotation.x += shape.rotationSpeed.x;
            shape.mesh.rotation.y += shape.rotationSpeed.y;
        });

        camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.03;
        camera.position.y += (mouseY * 1.2 - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate(0);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initThreeJS);

// ========== SCROLL OPTIMIZATION ==========
let scrollTimeout, lastScrollTop = 0, scrollVelocity = 0;

window.addEventListener('scroll', () => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    scrollVelocity = Math.abs(currentScrollTop - lastScrollTop);
    lastScrollTop = currentScrollTop;

    // Only pause on FAST scroll (>50px)
    if (scrollVelocity > 50) {
        animationPaused = true;
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        animationPaused = false;
    }, 100);
}, { passive: true });

// ========== NAVIGATION ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

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

const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
counters.forEach(counter => counterObserver.observe(counter));

// ========== VANILLA TILT ==========
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements, {
            max: 8,
            speed: 800,
            glare: true,
            'max-glare': 0.15,
        });
    }
});

// ========== TYPING EFFECT ==========
const typingElements = document.querySelectorAll('.typing-effect');

typingElements.forEach((element) => {
    const text = element.textContent;
    element.textContent = '';
    let index = 0;

    const type = () => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    };

    setTimeout(type, 1000);
});

// ========== SCROLL REVEAL ==========
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
        '.about-card, .skill-category, .skill-badge, .timeline-item, .project-card, .certificate-card, .contact-card'
    );

    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        fadeInObserver.observe(el);
    });
});

// ========== PROJECT PARALLAX (OPTIMIZED) ==========
document.querySelectorAll('.project-card').forEach((card) => {
    let isHovering = false;
    
    card.addEventListener('mouseenter', () => { isHovering = true; });
    card.addEventListener('mouseleave', () => {
        isHovering = false;
        card.style.transform = '';
    });
    
    card.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / 10) * 0.5;
        const rotateY = ((centerX - x) / 10) * 0.5;

        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
    });
});

// ========== EMAILJS ==========
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
        msg.style.background = isSuccess ? 'rgba(99, 102, 241, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        msg.style.color = isSuccess ? 'var(--accent-primary)' : '#ef4444';
        msg.style.border = isSuccess ? '1px solid var(--accent-primary)' : '1px solid #ef4444';
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

console.log('🚀 Portfolio Loaded - Bright animations with smooth scroll!');