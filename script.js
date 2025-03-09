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

// Horizontal Scroll
const initHorizontalScroll = () => {
    // Only initialize on desktop
    const horizontalM = gsap.matchMedia();
    
    horizontalM.add("(min-width: 991px)", () => {
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

        // Main horizontal scroll animation
        gsap.to(".container", {
            x: () => -(document.querySelector(".container").scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".wrapper",
                pin: true,
                scrub: 1,
                end: () => `+=${document.querySelector(".container").scrollWidth - window.innerWidth}`,
                invalidateOnRefresh: true
            }
        });

        // Section-specific animations
        gsap.utils.toArray("section").forEach((section, i) => {
            // Add scroll-triggered animations for each section
            ScrollTrigger.create({
                trigger: section,
                start: "left center",
                end: "right center",
                toggleClass: "active"
            });
        });
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initImageExpansion();
    initHorizontalScroll();
});
