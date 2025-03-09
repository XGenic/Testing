// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, Flip);

// Cursor Animation
const initCursor = () => {
    // Cursor Leave/Enter Animation
    jQuery(document).mouseleave(() => {
        gsap.to(".cursor", { scale: 0, duration: 0.1 });
    });

    jQuery(document).mouseenter(() => {
        gsap.to(".cursor", { scale: 1, duration: 0.1 });
    });

    // Cursor Follow
    gsap.set(".cursor", { 
        xPercent: -50, 
        yPercent: -50, 
        x: window.innerWidth / 2, 
        y: window.innerHeight / 2 
    });

    const xTo = gsap.quickTo(".cursor", "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(".cursor", "y", { duration: 0.15, ease: "power3" });

    window.addEventListener("mousemove", e => {
        xTo(e.clientX);
        yTo(e.clientY);
    });
};

// Shared cursor state management
const cursorManager = {
    circle: document.getElementById('circle'),
    expand: document.getElementById('expand'),
    isExpanded: false,

    showExpandCursor: (text) => {
        console.log('showExpandCursor called with text:', text);
        gsap.to(cursorManager.circle, { scale: 0, duration: 0.1 });
        cursorManager.expand.textContent = text;
        gsap.to(cursorManager.expand, { 
            scale: 1, 
            visibility: 'visible', 
            display: 'block',
            duration: 0.1 
        });
        console.log('Cursor state after show:', {
            text: cursorManager.expand.textContent,
            visibility: cursorManager.expand.style.visibility,
            display: cursorManager.expand.style.display
        });
    },

    hideExpandCursor: () => {
        console.log('hideExpandCursor called');
        gsap.to(cursorManager.circle, { scale: 1, duration: 0.1 });
        gsap.to(cursorManager.expand, { 
            scale: 0, 
            visibility: 'hidden', 
            display: 'none',
            duration: 0.1 
        });
    }
};

// Image Expansion
const initImageExpansion = () => {
    const container = document.getElementById('expanded-image-container');
    const expandedImg = document.getElementById('expanded-image');
    let currentScrollPosition = 0;

    const handleExpandedContainerHover = () => {
        console.log('Expanded container hover detected');
        cursorManager.showExpandCursor('Collapse');
    };

    const handleExpandedContainerLeave = () => {
        console.log('Expanded container leave detected');
        cursorManager.hideExpandCursor();
    };

    const expandImage = (img) => {
        console.log('expandImage called, setting up expanded state');
        currentScrollPosition = window.scrollY;
        
        const state = Flip.getState(img);
        expandedImg.src = img.getAttribute('data-full-img') || img.src;
        container.style.display = 'block';
        document.body.classList.add('no-scroll-transition');
        
        cursorManager.isExpanded = true;
        console.log('Adding hover listeners to expanded container');
        
        container.addEventListener('mouseenter', handleExpandedContainerHover);
        container.addEventListener('mouseleave', handleExpandedContainerLeave);
        
        gsap.to('.ap-img-wrap:not(:has(img[data-flip-id="' + img.dataset.flipId + '"]))', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut'
        });

        setTimeout(() => {
            container.classList.add('visible');
            Flip.from(state, {
                duration: 0.5,
                ease: "power2.inOut",
                absolute: true,
                onComplete: () => {
                    container.onclick = () => collapseImage(img);
                }
            });
        }, 0);
    };

    const collapseImage = (targetImg) => {
        console.log('collapseImage called, cleaning up expanded state');
        const state = Flip.getState(expandedImg);
        
        cursorManager.isExpanded = false;
        
        console.log('Removing hover listeners from expanded container');
        container.removeEventListener('mouseenter', handleExpandedContainerHover);
        container.removeEventListener('mouseleave', handleExpandedContainerLeave);
        
        container.classList.remove('visible');
        
        gsap.to('.ap-img-wrap', {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.inOut'
        });
        
        document.body.classList.remove('no-scroll-transition');
        window.scrollTo(0, currentScrollPosition);
        
        Flip.from(state, {
            duration: 0.5,
            ease: "power2.inOut",
            absolute: true,
            onComplete: () => {
                container.style.display = 'none';
                container.onclick = null;
            }
        });
    };

    // Add hover listeners to images
    const hoverImages = document.querySelectorAll('.hover-image');
    hoverImages.forEach(image => {
        image.addEventListener('mouseenter', () => {
            console.log('Original image hover detected');
            cursorManager.showExpandCursor('Expand');
        });
        
        image.addEventListener('mouseleave', () => {
            console.log('Original image leave detected');
            cursorManager.hideExpandCursor();
        });
    });

    // Add cursor-following behavior for descriptions
    document.querySelectorAll('.ap-img-wrap').forEach(wrap => {
        const description = wrap.querySelector('.ap-img-description');
        
        wrap.addEventListener('mousemove', (e) => {
            const rect = wrap.getBoundingClientRect();
            const y = e.clientY - rect.top;
            const percent = (y / rect.height) * 100;
            
            // Clamp the description position between 2% and 98% of the image height
            const clampedPercent = Math.max(2, Math.min(98, percent));
            
            gsap.to(description, {
                top: `${clampedPercent}%`,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });

    // Add click listeners to expandable images
    document.querySelectorAll('.expandable-image').forEach(img => {
        img.addEventListener('click', () => expandImage(img));
    });
};

// Scroll Snapping
const initScrollSnapping = () => {
    const sections = gsap.utils.toArray("section");
    const lastSection = sections[sections.length - 1];
    let snapProgress = 0;
    let lastScrollTime = 0;
    const SCROLL_COOLDOWN = 500;

    // Only apply scroll snapping to the last section (vertical scroll)
    ScrollTrigger.create({
        trigger: lastSection,
        start: "top top",
        end: "bottom bottom",
        snap: 1
    });
};

// Horizontal Scroll
const initHorizontalScroll = () => {
    // Only initialize on desktop
    const horizontalM = gsap.matchMedia();
    
    horizontalM.add("(min-width: 991px)", () => {
        const sections = gsap.utils.toArray("section");
        const lastSectionIndex = sections.length - 1;
        
        // Add the wrapper class for horizontal scrolling
        document.querySelector('.wrapper').classList.add('section-height');
        document.querySelector('.container').classList.add('track');

        // Set section heights based on content width
        const setTrackHeights = () => {
            document.querySelectorAll('.section-height').forEach(section => {
                const trackWidth = section.querySelector('.track')?.offsetWidth || 0;
                section.style.height = `${trackWidth}px`;
            });
        };

        setTrackHeights();
        window.addEventListener("resize", setTrackHeights);

        // Calculate snap points for each section
        const getSnapPoints = () => {
            const points = [];
            const container = document.querySelector(".container");
            const containerWidth = container.scrollWidth - window.innerWidth;
            
            sections.forEach((section) => {
                const sectionLeft = section.offsetLeft;
                const normalizedPosition = sectionLeft / containerWidth;
                points.push(normalizedPosition);
            });
            
            return points;
        };

        // Main horizontal scroll animation
        const horizontalScroll = gsap.to(".container", {
            x: () => -(document.querySelector(".container").scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".wrapper",
                pin: true,
                scrub: 0.5,
                snap: {
                    snapTo: getSnapPoints(),
                    duration: 0.5,
                    ease: "power4.out",
                    delay: 0,
                    inertia: false
                },
                end: () => `+=${document.querySelector(".container").scrollWidth - window.innerWidth}`,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (self.progress >= 0.99) {
                        document.querySelector('.container').style.position = 'relative';
                    } else {
                        document.querySelector('.container').style.position = 'fixed';
                    }
                }
            }
        });

        // Section-specific animations
        sections.forEach((section, i) => {
            if (i < lastSectionIndex) {
                ScrollTrigger.create({
                    trigger: section,
                    containerAnimation: horizontalScroll,
                    start: "left left",
                    end: "right left",
                    toggleClass: "active"
                });
            }
        });

        // Update snap points on resize
        window.addEventListener("resize", () => {
            horizontalScroll.scrollTrigger.snap = getSnapPoints();
        });
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initImageExpansion();
    initHorizontalScroll();
    initScrollSnapping();
});
