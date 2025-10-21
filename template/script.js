// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// GSAP ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
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

// GSAP animations for hero section
gsap.timeline()
    .from('.hero-content h1', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.hero-content h2', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-content p', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-buttons', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.4');

// Floating animation for tech stack cards
gsap.to('.tech-stack span', {
    y: -10,
    duration: 2,
    ease: 'power2.inOut',
    stagger: 0.2,
    repeat: -1,
    yoyo: true
});

// Stats counter animation
const animateCounter = (element, target) => {
    gsap.to(element, {
        innerHTML: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            once: true
        }
    });
};

// Initialize counter animations
document.querySelectorAll('.stat h3').forEach(stat => {
    const text = stat.textContent;
    const number = parseInt(text);
    if (!isNaN(number)) {
        stat.textContent = '0';
        animateCounter(stat, number);
    }
});

// Skill tags stagger animation
gsap.set('.skill-tags span', { opacity: 0, y: 20 });

ScrollTrigger.batch('.skill-tags span', {
    onEnter: elements => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });
    },
    start: 'top 85%'
});

// Timeline items animation
gsap.set('.timeline-item', { opacity: 0, x: 100 });

ScrollTrigger.batch('.timeline-item', {
    onEnter: (elements, triggers) => {
        elements.forEach((element, index) => {
            const isEven = index % 2 === 1;
            gsap.to(element, {
                opacity: 1,
                x: 0,
                duration: 1,
                delay: index * 0.2,
                ease: 'power3.out'
            });
        });
    },
    start: 'top 80%'
});

// Education items animation
gsap.set('.education-item', { opacity: 0, y: 50 });

ScrollTrigger.batch('.education-item', {
    onEnter: elements => {
        gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
    },
    start: 'top 80%'
});

// Parallax effect for hero background
gsap.to('.hero::before', {
    yPercent: -50,
    ease: 'none',
    scrollTrigger: {
        trigger: '.hero',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

// Contact items hover animation
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Button hover animations
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Reveal animations for sections
const revealSections = gsap.utils.toArray('section');
revealSections.forEach(section => {
    gsap.fromTo(section, 
        { opacity: 0.8 },
        {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 70%',
                end: 'bottom 30%',
                scrub: true
            }
        }
    );
});

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        const navMenu = document.querySelector('.nav-menu');
        const navLogo = document.querySelector('.nav-logo');
        
        if (!document.querySelector('.mobile-toggle')) {
            const mobileToggle = document.createElement('div');
            mobileToggle.className = 'mobile-toggle';
            mobileToggle.innerHTML = '☰';
            mobileToggle.style.cssText = `
                display: block;
                font-size: 1.5rem;
                cursor: pointer;
                color: #333;
            `;
            
            navLogo.parentNode.appendChild(mobileToggle);
            
            mobileToggle.addEventListener('click', () => {
                navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '100%';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'white';
                navMenu.style.flexDirection = 'column';
                navMenu.style.padding = '1rem';
                navMenu.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            });
        }
    }
};

// Initialize mobile menu on load and resize
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Preloader (optional)
window.addEventListener('load', () => {
    gsap.to('body', {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
    });
});

// Initialize body opacity
gsap.set('body', { opacity: 0 });