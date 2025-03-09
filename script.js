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

    // Cursor State Toggle
    const circle = document.getElementById('circle');
    const expand = document.getElementById('expand');

    const toggleCursor = (isInImage) => {
        if (isInImage) {
            gsap.to(circle, { scale: 0, duration: 0.1 });
            gsap.to(expand, { 
                scale: 1, 
                visibility: 'visible', 
                display: 'block',
                duration: 0.1 
            });
        } else {
            gsap.to(circle, { scale: 1, duration: 0.1 });
            gsap.to(expand, { 
                scale: 0, 
                visibility: 'hidden',
                display: 'none',
                duration: 0.1 
            });
        }
    };

    // Add hover listeners to images
    const hoverImages = document.querySelectorAll('.hover-image');
    hoverImages.forEach(image => {
        image.addEventListener('mouseenter', () => toggleCursor(true));
        image.addEventListener('mouseleave', () => toggleCursor(false));
    });
};

// Image Expansion
const initImageExpansion = () => {
    const container = document.getElementById('expanded-image-container');
    const expandedImg = document.getElementById('expanded-image');

    const expandImage = (img) => {
        // Get the clicked image's position and dimensions
        const state = Flip.getState(img);
        
        // Set the expanded image source
        expandedImg.src = img.getAttribute('data-full-img') || img.src;
        
        // Show the container
        container.style.display = 'block';
        setTimeout(() => container.classList.add('visible'), 0);

        // Animate from the initial state
        Flip.from(state, {
            duration: 0.5,
            ease: "power2.inOut",
            absolute: true,
            onComplete: () => {
                // Add click listener to close
                container.onclick = () => collapseImage(img);
            }
        });
    };

    const collapseImage = (targetImg) => {
        // Get the current state
        const state = Flip.getState(expandedImg);
        
        // Hide the container
        container.classList.remove('visible');
        
        // Animate back to the original image
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
