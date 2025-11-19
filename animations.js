class ScrollAnimations {
    constructor() {
        this.scrollElements = document.querySelectorAll('[data-scroll]');
        this.init();
    }

    init() {
        this.initParticles();
        this.initScrollAnimations();
        this.initButtonEffects();
    }

    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: "#00ff88" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#00ff88",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    }
                }
            });
        }
    }

    initScrollAnimations() {
        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend;
        };

        const displayScrollElement = (element) => {
            element.classList.add('visible');
        };

        const handleScrollAnimation = () => {
            this.scrollElements.forEach((el) => {
                if (elementInView(el, 1.2)) {
                    displayScrollElement(el);
                }
            });
        };

        window.addEventListener('scroll', handleScrollAnimation);
        handleScrollAnimation();
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});