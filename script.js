// Helper function to split text into spans with staggered animation delays
function createSplitAnimations() {
    // Split By Letter
    const splitLetters = document.querySelectorAll('.split-letters');
    splitLetters.forEach(el => {
        // Only process if not already processed
        if (el.querySelector('span') && el.classList.contains('logo')) {
            // Keep logo span intact (neon-text-red) - slight edge case, so we skip standard split
            return; 
        }
        
        let originalNavText = null;
        if(el.classList.contains('logo')){
            // custom split for logo
            el.innerHTML = '<span style="animation-delay: 0.1s">K</span><span style="animation-delay: 0.2s">S</span><span style="animation-delay: 0.3s">K</span><span class="neon-text-red" style="animation-delay: 0.4s">.</span>';
            return;
        }

        const text = el.innerText;
        el.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char;
            // Spaces need to be non-breaking so they have width
            if (char === ' ') span.innerHTML = '&nbsp;';
            
            // Stagger delay for entrance
            span.style.animationDelay = `${i * 0.05}s`;
            // Set transition delay for reveal
            span.style.transitionDelay = `${(i * 0.03)}s`;
            
            el.appendChild(span);
        });
    });

    // Split By Word (for longer paragraphs/subtitles)
    const splitWords = document.querySelectorAll('.split-words');
    splitWords.forEach(el => {
        const words = el.innerText.split(' ');
        el.innerHTML = '';
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.innerHTML = word + '&nbsp;';
            span.style.transitionDelay = `${i * 0.05}s`;
            el.appendChild(span);
        });
    });
}

// Configuration for Particles JS with Neon Aesthetic
function initParticles() {
    if(typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 70, "density": { "enable": true, "value_area": 900 } },
                "color": { "value": ["#000080", "#1e3a8a", "#0f172a", "#1e40af", "#3b82f6"] },
                "shape": { "type": "circle" },
                "opacity": { 
                    "value": 0.6, "random": true, 
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } 
                },
                "size": { 
                    "value": 4, "random": true, 
                    "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } 
                },
                "line_linked": { "enable": true, "distance": 150, "color": "#1e3a8a", "opacity": 0.4, "width": 1.5 },
                "move": { "enable": true, "speed": 1.2, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 160, "line_linked": { "opacity": 0.6 } },
                    "push": { "particles_nb": 3 }
                }
            },
            "retina_detect": true
        });
    }
}

// Scroll Reveal Animation Functionality
function revealOnScroll() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;

        // If element is in viewport
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // -1. Simple Preloader Logic
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Lock scrolling while loading
        document.body.style.overflow = "hidden";
        
        // Fade out after a short delay
        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflow = "auto";
        }, 1500);
    }

    // 0. Auto-apply letter animation to all dynamic headings
    document.querySelectorAll('h2, h3, .tagline').forEach(el => {
        if (!el.classList.contains('split-letters') && !el.classList.contains('split-words')) {
            el.classList.add('split-letters');
        }
    });

    // 1. Initialize text splitting
    createSplitAnimations();

    // 1.5 Typewriter Effect for Main Heading
    const typeText = "SATHWIK KUMAR";
    const typeElement = document.getElementById('typewriter');
    if (typeElement) {
        let textIndex = 0;
        function type() {
            if (textIndex < typeText.length) {
                typeElement.innerHTML += typeText.charAt(textIndex);
                textIndex++;
                setTimeout(type, Math.random() * 100 + 80); // random typing delay
            }
        }
        setTimeout(type, 800); // initial delay
    }

    // 2. Initialize Particles
    setTimeout(initParticles, 100);

    // 3. Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 4. Form Submission Handling Simulation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // IMPORTANT: You MUST replace this URL with the Web App URL generated from your Google Apps Script!
    // I have provided the exact instructions on how to get this URL in the chat.
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzOkJVVlbcGBHbtoHh5dFFudVQG4E6JkyhFkukKStIDGwvRVZsA_3Jv8HoGNosvsj28rA/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;
            btn.innerHTML = '<span class="neon-text-red">Sending Transmission...</span>';
            btn.disabled = true;

            // Submit to Google Sheets via Apps Script Web App
            fetch(scriptURL, { 
                method: 'POST', 
                body: new FormData(contactForm),
                mode: 'no-cors' // Prevent CORS errors when submitting to Google
            })
                .then(response => {
                    // Note: no-cors mode returns an opaque response, so we just assume success.
                    formStatus.innerHTML = `<span style="color: var(--neon-orange); font-weight: bold;">Transmission Successful! Data received at the mainframe.</span>`;
                    contactForm.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    setTimeout(() => { formStatus.innerHTML = ''; }, 6000);
                })
                .catch(error => {
                    formStatus.innerHTML = `<span style="color: var(--neon-red); font-weight: bold;">Error: Setup Required! Please configure your Google Apps Script URL.</span>`;
                    console.error('Submission Error!', error.message);
                    btn.textContent = originalText;
                    btn.disabled = false;
                    setTimeout(() => { formStatus.innerHTML = ''; }, 6000);
                });
        });
    }

    // 5. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        revealOnScroll();
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 6. Premium Glow Cursor Tracking
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorGlow = document.querySelector('.cursor-glow');

    if (cursorDot && cursorGlow) {
        window.addEventListener('mousemove', function(e) {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorGlow.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 2500, fill: "forwards", easing: "ease" });
        });

        // Hover effect for interactive elements
        document.querySelectorAll('a, button, input, textarea, .glass').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
                cursorDot.style.backgroundColor = 'var(--neon-blue)';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorDot.style.backgroundColor = 'var(--neon-red)';
            });
        });
    }
    
    // 7. VanillaTilt Initialization (3D Dancing Frames)
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".glass:not(.input-glass)"), {
            max: 8,
            speed: 400,
            glare: true,
            "max-glare": 0.15,
            scale: 0.98, // Native sink effect
            perspective: 1000
        });
    }

    // Initial checks on page load
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    revealOnScroll();
});

// Image Modal Functions
function openModal(imgElement) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("enlargedImg");
    const captionText = document.getElementById("modalCaption");
    
    modal.style.display = "block";
    modalImg.src = imgElement.getAttribute('data-full-cert') || imgElement.src;
    captionText.innerHTML = imgElement.alt;
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
}

// Close modal if user clicks outside the image
window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
