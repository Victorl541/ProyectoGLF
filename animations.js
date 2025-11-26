class ScrollAnimations {
    constructor() {
        this.scrollElements = document.querySelectorAll('[data-scroll]');
        this.init();
    }

    init() {
        this.initParticles();
        this.initScrollAnimations();
        this.initButtonEffects();
        this.initStateNodeEffects();
    }

    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { 
                        value: 100, 
                        density: { 
                            enable: true, 
                            value_area: 800 
                        } 
                    },
                    color: { 
                        value: ["#00ff88", "#ff0080", "#0080ff"] 
                    },
                    shape: { 
                        type: ["circle", "triangle"],
                        stroke: {
                            width: 0
                        }
                    },
                    opacity: { 
                        value: 0.6, 
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: { 
                        value: 4, 
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 0.5,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#00ff88",
                        opacity: 0.3,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: true,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { 
                            enable: true, 
                            mode: "grab" 
                        },
                        onclick: { 
                            enable: true, 
                            mode: "push" 
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 0.8
                            }
                        },
                        push: {
                            particles_nb: 4
                        }
                    }
                },
                retina_detect: true
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

        window.addEventListener('scroll', () => {
            requestAnimationFrame(handleScrollAnimation);
        });
        
        // Ejecutar al cargar
        handleScrollAnimation();
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Efectos hover suaves
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }

    initStateNodeEffects() {
        const stateNodes = document.querySelectorAll('.state-node');
        
        stateNodes.forEach(node => {
            // Efecto hover con información
            node.addEventListener('mouseenter', function() {
                const stateId = this.id.replace('state-', '');
                const info = getStateInfo(stateId);
                
                // Crear tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'state-tooltip';
                tooltip.textContent = info;
                tooltip.style.cssText = `
                    position: absolute;
                    top: -40px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: var(--primary-color);
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    white-space: nowrap;
                    z-index: 100;
                    border: 1px solid var(--primary-color);
                    animation: fadeInTooltip 0.3s ease;
                `;
                
                this.appendChild(tooltip);
            });
            
            node.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.state-tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });

            // Efecto click con onda expansiva
            node.addEventListener('click', function() {
                const wave = document.createElement('div');
                wave.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 2px solid var(--primary-color);
                    animation: waveExpand 0.8s ease-out;
                    pointer-events: none;
                `;
                
                this.appendChild(wave);
                
                setTimeout(() => {
                    wave.remove();
                }, 800);
            });
        });

        // Agregar animaciones CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInTooltip {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes waveExpand {
                from {
                    transform: scale(1);
                    opacity: 1;
                }
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Función auxiliar para información de estados
function getStateInfo(stateId) {
    const stateDescriptions = {
        'q0': 'Estado Inicial - Esperando primer dígito',
        'q1': 'Estado 1 - 1 dígito leído',
        'q2': 'Estado 2 - 2 dígitos leídos',
        'q3': 'Estado 3 - 3 dígitos leídos',
        'q4': 'Estado 4 - 4 dígitos (puede aceptar)',
        'q5': 'Estado 5 - 5 dígitos leídos',
        'q6': 'Estado 6 - 6 dígitos (puede aceptar)',
        'accept': 'Estado de ACEPTACIÓN ✓',
        'reject': 'Estado de RECHAZO ✗'
    };
    
    return stateDescriptions[stateId] || 'Estado desconocido';
}

// Efecto de parallax en el hero
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - (scrolled * 0.002);
            }
        });
    }
}

// Efecto de typing en el título
function initTypingEffect() {
    const title = document.querySelector('.title');
    
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        let index = 0;
        
        const typeWriter = () => {
            if (index < originalText.length) {
                title.textContent += originalText.charAt(index);
                index++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Iniciar después de un pequeño delay
        setTimeout(typeWriter, 500);
    }
}

// Contador animado para números
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Efecto de shake para errores
function shakeElement(element) {
    if (!element) return;
    
    element.style.animation = 'shake 0.5s';
    
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
    
    // Agregar animación shake si no existe
    if (!document.getElementById('shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    initParallax();
    // initTypingEffect(); // Descomenta si quieres el efecto de typing
    
    // Smooth scroll para el indicador
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
});