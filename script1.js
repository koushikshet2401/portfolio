// ====================================================================================
// ULTRA MODERN PORTFOLIO 2026 - JAVASCRIPT
// ====================================================================================

// ========== LENIS SMOOTH SCROLL ==========
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Stop Lenis on wheel events to prevent conflicts
let isScrolling;
window.addEventListener('wheel', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        lenis.start();
    }, 100);
}, { passive: true });

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ========== THREE.JS ANIMATED BACKGROUND ==========
function initThreeJS() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth > 768 ? 200 : 100; // Reduced from 500
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 40; // Reduced spread
        colorArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1, // Reduced from 0.15
        vertexColors: true,
        transparent: true,
        opacity: 0.6, // Reduced from 0.8
        blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create geometric shapes
    const geometries = [
        new THREE.TetrahedronGeometry(0.8), // Reduced size
        new THREE.OctahedronGeometry(0.8),
        new THREE.IcosahedronGeometry(0.8),
        new THREE.TorusGeometry(0.8, 0.3, 16, 100),
    ];

    const shapes = [];
    for (let i = 0; i < 8; i++) { // Reduced from 15 to 8
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.15, // Reduced from 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 25, // Reduced spread
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 20
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        shapes.push({
            mesh: mesh,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01, // Reduced speed
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01,
            }
        });
        scene.add(mesh);
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    document.addEventListener('mousemove', (event) => {
        targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation
    const clock = new THREE.Clock();
    let frameCount = 0;

    function animate() {
        requestAnimationFrame(animate);
        frameCount++;
        
        // Skip every other frame for better performance
        if (frameCount % 2 !== 0) return;
        
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse interpolation
        mouseX += (targetMouseX - mouseX) * 0.02;
        mouseY += (targetMouseY - mouseY) * 0.02;

        // Rotate particles slower
        particlesMesh.rotation.y = elapsedTime * 0.03;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

        // Animate shapes (reduced complexity)
        shapes.forEach((shape, index) => {
            shape.mesh.rotation.x += shape.rotationSpeed.x;
            shape.mesh.rotation.y += shape.rotationSpeed.y;
            shape.mesh.rotation.z += shape.rotationSpeed.z;

            // Floating animation (every 4th shape only)
            if (index % 4 === 0) {
                shape.mesh.position.y += Math.sin(elapsedTime + index) * 0.005;
            }
        });

        // Reduced mouse interaction
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Initialize Three.js
document.addEventListener('DOMContentLoaded', initThreeJS);

// ========== NAVIGATION ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Hamburger menu
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close with ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
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

const counterObserver = new IntersectionObserver(animateCounters, {
    threshold: 0.5
});

counters.forEach(counter => counterObserver.observe(counter));

// ========== VANILLA TILT ==========
document.addEventListener('DOMContentLoaded', () => {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements, {
            max: 10,
            speed: 1000,
            glare: true,
            'max-glare': 0.2,
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

    // Start typing after a delay
    setTimeout(type, 1000);
});

// ========== SCROLL REVEAL ANIMATIONS ==========
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

// Observe all animated elements
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

// ========== PROJECT CARDS PARALLAX (OPTIMIZED) ==========
document.querySelectorAll('.project-card').forEach((card) => {
    let isHovering = false;
    
    card.addEventListener('mouseenter', () => {
        isHovering = true;
    });
    
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

        const rotateX = ((y - centerY) / 10) * 0.5; // Reduced intensity
        const rotateY = ((centerX - x) / 10) * 0.5;

        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
    });
});

// ========== CURSOR TRAIL EFFECT ==========
const createCursorTrail = () => {
    const trail = [];
    const trailLength = 20;

    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY });
        if (trail.length > trailLength) {
            trail.shift();
        }

        updateTrail();
    });

    function updateTrail() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');

        requestAnimationFrame(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            trail.forEach((point, index) => {
                const opacity = index / trailLength;
                const size = (index / trailLength) * 5;

                ctx.beginPath();
                ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.3})`;
                ctx.fill();
            });
        });

        if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
        }
    }
};

// createCursorTrail(); // Uncomment for cursor trail

// ========== PARTICLE TEXT EFFECT (OPTIMIZED) ==========
const createParticleText = () => {
    const titles = document.querySelectorAll('.section-title');
    let lastTrigger = 0;

    titles.forEach((title) => {
        title.addEventListener('mouseenter', () => {
            // Throttle effect to once per 2 seconds
            const now = Date.now();
            if (now - lastTrigger < 2000) return;
            lastTrigger = now;
            
            const rect = title.getBoundingClientRect();
            const particleCount = 15; // Reduced from 30

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed'; // Changed from absolute
                particle.style.left = rect.left + Math.random() * rect.width + 'px';
                particle.style.top = rect.top + Math.random() * rect.height + 'px';
                particle.style.width = '3px'; // Reduced from 4px
                particle.style.height = '3px';
                particle.style.background = 'var(--accent-primary)';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9999';

                document.body.appendChild(particle);

                const angle = Math.random() * Math.PI * 2;
                const velocity = 1.5 + Math.random() * 2; // Reduced velocity
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;

                let opacity = 1;
                let x = parseFloat(particle.style.left);
                let y = parseFloat(particle.style.top);

                const animate = () => {
                    x += vx;
                    y += vy;
                    opacity -= 0.03; // Faster fade

                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.opacity = opacity;

                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        if (document.body.contains(particle)) {
                            document.body.removeChild(particle);
                        }
                    }
                };

                animate();
            }
        });
    });
};

// Only create particle text on desktop
if (window.innerWidth > 768) {
    createParticleText();
}

// ========== EMAILJS FORM SUBMISSION ==========
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
        msg.style.background = isSuccess
            ? 'rgba(99, 102, 241, 0.1)'
            : 'rgba(239, 68, 68, 0.1)';
        msg.style.color = isSuccess ? 'var(--accent-primary)' : '#ef4444';
        msg.style.border = isSuccess
            ? '1px solid var(--accent-primary)'
            : '1px solid #ef4444';
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

        emailjs
            .sendForm('service_dhlqq6e', 'template_8ri1x28', contactForm)
            .then(() => {
                showFormMessage(
                    '✓ Message sent successfully! I will get back to you soon.',
                    true
                );

                contactForm.reset();
                button.disabled = false;
                button.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
            })
            .catch((error) => {
                showFormMessage(
                    '✗ Something went wrong. Please email me directly at koushikshet2401@gmail.com',
                    false
                );

                button.disabled = false;
                button.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';

                console.error('EmailJS Error:', error);
            });
    });
}

// ========== PERFORMANCE OPTIMIZATION ==========
// Reduce animations on mobile and during scroll
let isUserScrolling = false;
let scrollTimeout;

window.addEventListener('scroll', () => {
    isUserScrolling = true;
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
    }, 150);
}, { passive: true });

if (window.innerWidth < 768) {
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        canvas.style.opacity = '0.3';
    }
}

// Disable particle explosions on slower devices
const isSlow = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
if (isSlow) {
    console.log('Low-end device detected, reducing effects');
}

// ========== RANDOM BACKGROUND COLOR SHIFT ==========
setInterval(() => {
    // Don't shift colors while scrolling for better performance
    if (isUserScrolling) return;
    
    const currentTheme = html.getAttribute('data-theme');
    const heroAnimation = document.querySelector('.hero-bg-animation');
    
    if (heroAnimation) {
        const randomHue = Math.random() * 360;
        if (currentTheme === 'light') {
            heroAnimation.style.background = `linear-gradient(135deg, hsl(${randomHue}, 70%, 60%), hsl(${randomHue + 30}, 70%, 60%))`;
        } else {
            heroAnimation.style.background = `linear-gradient(135deg, hsl(${randomHue}, 90%, 50%), hsl(${randomHue + 30}, 90%, 50%))`;
        }
    }
}, 5000);

console.log('🚀 Ultra Modern Portfolio 2026 Loaded!');