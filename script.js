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
    let isExpanded = false;

    const toggleCursor = (isInImage) => {
        if (isInImage && !isExpanded) {
            gsap.to(circle, { scale: 0, duration: 0.1 });
            gsap.to(expand, { scale: 1, visibility: 'visible', duration: 0.1 });
        } else if (!isInImage && !isExpanded) {
            gsap.to(circle, { scale: 1, duration: 0.1 });
            gsap.to(expand, { scale: 0, visibility: 'hidden', duration: 0.1 });
        }
    };

    // Add hover listeners to images
    const hoverImages = document.querySelectorAll('.hover-image');
    hoverImages.forEach(image => {
        image.addEventListener('mouseenter', () => toggleCursor(true));
        image.addEventListener('mouseleave', () => toggleCursor(false));
    });

    // Add listener for expanded image container
    const container = document.getElementById('expanded-image-container');
    container.addEventListener('mouseenter', () => {
        isExpanded = true;
        gsap.to(circle, { scale: 1, duration: 0.1 });
        gsap.to(expand, { scale: 0, visibility: 'hidden', duration: 0.1 });
    });
    container.addEventListener('mouseleave', () => {
        isExpanded = false;
    });
};

// Image Expansion
const initImageExpansion = () => {
    const container = document.getElementById('expanded-image-container');
    const expandedImg = document.getElementById('expanded-image');
    let currentImg = null;
    let scrollPosition = 0;

    const logScrollTriggerState = (prefix) => {
        console.log(`${prefix} - ScrollY:`, window.scrollY);
        console.log(`${prefix} - Container Transform:`, document.querySelector('.container').style.transform);
        
        const triggers = ScrollTrigger.getAll();
        console.log(`${prefix} - ScrollTrigger instances:`, triggers.length);
        
        triggers.forEach((st, index) => {
            try {
                const state = {
                    isActive: st.isActive,
                    progress: st.vars.animation ? st.vars.animation.progress() : 'no animation',
                    pinned: st.pin ? true : false,
                    direction: st.direction,
                    trigger: st.trigger ? st.trigger.className || st.trigger.id || 'unnamed' : 'none',
                    start: st.vars.start,
                    end: st.vars.end,
                    scrub: st.vars.scrub,
                    animation: st.animation ? {
                        time: st.animation.time(),
                        totalTime: st.animation.totalTime(),
                        paused: st.animation.paused()
                    } : 'none'
                };
                console.log(`${prefix} - ScrollTrigger #${index}:`, state);
            } catch (err) {
                console.warn(`Error logging ScrollTrigger #${index}:`, err);
            }
        });
    };

    const expandImage = (img) => {
        currentImg = img;
        scrollPosition = window.scrollY;
        
        try {
            logScrollTriggerState('Before expand');
        } catch (e) {
            console.warn('Error logging ScrollTrigger state:', e);
        }
        
        const state = Flip.getState(img);
        expandedImg.src = img.getAttribute('data-full-img') || img.src;
        
        container.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        container.offsetHeight;
        container.classList.add('visible');

        Flip.from(state, {
            duration: 0.5,
            ease: "power2.inOut",
            absolute: true,
            onComplete: () => {
                try {
                    logScrollTriggerState('After expand');
                } catch (e) {
                    console.warn('Error logging ScrollTrigger state:', e);
                }
                container.onclick = () => collapseImage(img);
            }
        });
    };

    const collapseImage = (targetImg) => {
        if (!currentImg) return;
        
        try {
            logScrollTriggerState('Before collapse');
        } catch (e) {
            console.warn('Error logging ScrollTrigger state:', e);
        }
        
        const state = Flip.getState(expandedImg);
        const containerElement = document.querySelector('.container');
        const circle = document.getElementById('circle');
        const expand = document.getElementById('expand');
        const sections = gsap.utils.toArray("section");
        
        // Store the original scroll state and ScrollTrigger states
        const originalStates = {
            scroll: window.scrollY,
            transform: containerElement.style.transform,
            triggers: ScrollTrigger.getAll().map(st => ({
                progress: st.progress,
                isActive: st.isActive,
                direction: st.direction
            }))
        };
        
        // Extract the x position consistently
        const match = originalStates.transform.match(/translate3d\(([-\d.]+)px/);
        const currentX = match ? Math.abs(parseFloat(match[1])) : 0;
        
        container.classList.remove('visible');
        
        gsap.to(circle, { scale: 1, duration: 0.1 });
        gsap.to(expand, { scale: 0, visibility: 'hidden', duration: 0.1 });
        
        Flip.from(state, {
            duration: 0.5,
            ease: "power2.inOut",
            absolute: true,
            onComplete: () => {
                container.style.display = 'none';
                container.onclick = null;
                
                // Temporarily prevent any scroll position changes
                const preventScroll = (e) => e.preventDefault();
                window.addEventListener('scroll', preventScroll, { passive: false });
                
                // Kill all ScrollTrigger instances but save their states
                ScrollTrigger.getAll().forEach(st => st.kill());
                
                // Force GSAP to clear its internal cache
                ScrollTrigger.clearScrollMemory();
                ScrollTrigger.enable(false);
                
                // Calculate total width before reinitialization
                const totalWidth = sections.reduce((acc, section) => {
                    return acc + section.offsetWidth;
                }, 0);
                
                // Set container width
                containerElement.style.width = `${totalWidth}px`;
                
                // Set initial position before creating ScrollTrigger
                gsap.set(containerElement, {
                    x: -currentX,
                    force3D: true,
                    immediateRender: true
                });
                
                // Re-enable ScrollTrigger
                ScrollTrigger.enable(true);
                
                // Create main horizontal scroll animation
                const horizontalScroll = gsap.to(containerElement, {
                    x: () => -(totalWidth - window.innerWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".wrapper",
                        pin: true,
                        scrub: 1,
                        snap: {
                            snapTo: (progress) => {
                                const sectionProgress = sections.map((section, i) => {
                                    const sectionWidth = section.offsetWidth;
                                    const sectionStart = sections.slice(0, i).reduce((acc, s) => acc + s.offsetWidth, 0);
                                    const sectionProgress = sectionStart / (totalWidth - window.innerWidth);
                                    return sectionProgress;
                                });
                                let closest = sectionProgress.reduce((prev, curr) => {
                                    return (Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev);
                                });
                                return closest;
                            },
                            duration: {min: 0.2, max: 0.6},
                            ease: "power1.inOut"
                        },
                        start: "top top",
                        end: () => `+=${totalWidth - window.innerWidth}`,
                        invalidateOnRefresh: true
                    }
                });
                
                // Set up section-specific animations with preserved states
                sections.forEach((section, i) => {
                    const originalState = originalStates.triggers[i + 1];
                    ScrollTrigger.create({
                        trigger: section,
                        containerAnimation: horizontalScroll,
                        start: "left center",
                        end: "right center",
                        toggleClass: "active",
                        onEnter: () => {
                            gsap.to(section, { opacity: 1, duration: 0.3 });
                        },
                        onLeave: () => {
                            if (i !== sections.length - 1) {
                                gsap.to(section, { opacity: 0.3, duration: 0.3 });
                            }
                        },
                        onEnterBack: () => {
                            gsap.to(section, { opacity: 1, duration: 0.3 });
                        },
                        onLeaveBack: () => {
                            gsap.to(section, { opacity: 0.3, duration: 0.3 });
                        }
                    });
                });
                
                // Force scroll to the correct position
                window.scrollTo(0, originalStates.scroll);
                
                // Update ScrollTrigger
                ScrollTrigger.refresh(true);
                
                // Remove scroll prevention
                window.removeEventListener('scroll', preventScroll);
                
                // Final position enforcement with a slight delay
                setTimeout(() => {
                    gsap.set(containerElement, {
                        x: -currentX,
                        force3D: true,
                        immediateRender: true
                    });
                    
                    // Force scroll position again
                    window.scrollTo(0, originalStates.scroll);
                    
                    // Final refresh
                    ScrollTrigger.refresh(true);
                    
                    // Re-enable body scrolling
                    document.body.style.overflow = '';
                }, 100);
                
                try {
                    logScrollTriggerState('After scroll restore');
                } catch (e) {
                    console.warn('Error during scroll restore:', e);
                }
                
                currentImg = null;
            }
        });
    };

    // Add click listeners to expandable images
    document.querySelectorAll('.expandable-image').forEach(img => {
        img.addEventListener('click', () => expandImage(img));
    });

    // Add escape key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentImg) {
            collapseImage(currentImg);
        }
    });
};

// Horizontal Scroll
const initHorizontalScroll = () => {
    // Only initialize on desktop
    const horizontalM = gsap.matchMedia();
    
    horizontalM.add("(min-width: 991px)", () => {
        // Calculate total width
        const sections = gsap.utils.toArray("section");
        const totalWidth = sections.reduce((acc, section) => {
            return acc + section.offsetWidth;
        }, 0);

        // Set container width
        document.querySelector('.container').style.width = `${totalWidth}px`;

        // Main horizontal scroll animation
        const horizontalScroll = gsap.to(".container", {
            x: () => -(totalWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: ".wrapper",
                pin: true,
                scrub: 1,
                snap: {
                    snapTo: (progress) => {
                        // Calculate which section we're closest to
                        const sectionProgress = sections.map((section, i) => {
                            const sectionWidth = section.offsetWidth;
                            const sectionStart = sections.slice(0, i).reduce((acc, s) => acc + s.offsetWidth, 0);
                            const sectionProgress = sectionStart / (totalWidth - window.innerWidth);
                            return sectionProgress;
                        });
                        
                        // Find the closest section
                        let closest = sectionProgress.reduce((prev, curr) => {
                            return (Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev);
                        });
                        
                        return closest;
                    },
                    duration: {min: 0.2, max: 0.6}, // Adjust these values to control the "magnetism" strength
                    ease: "power1.inOut"
                },
                end: () => `+=${totalWidth - window.innerWidth}`,
                invalidateOnRefresh: true
            }
        });

        // Section-specific animations
        sections.forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                containerAnimation: horizontalScroll,
                start: "left center",
                end: "right center",
                toggleClass: "active",
                onEnter: () => {
                    gsap.to(section, { opacity: 1, duration: 0.3 });
                },
                onLeave: () => {
                    if (i !== sections.length - 1) { // Don't fade the last section
                        gsap.to(section, { opacity: 0.3, duration: 0.3 });
                    }
                },
                onEnterBack: () => {
                    gsap.to(section, { opacity: 1, duration: 0.3 });
                },
                onLeaveBack: () => {
                    gsap.to(section, { opacity: 0.3, duration: 0.3 });
                }
            });
        });

        // Special handling for last section vertical scroll
        const lastSection = sections[sections.length - 1];
        const verticalScrollHeight = window.innerHeight * 2; // 2 viewport heights of additional content

        lastSection.style.height = `${window.innerHeight + verticalScrollHeight}px`;
        
        ScrollTrigger.create({
            trigger: lastSection,
            start: "top top",
            end: `+=${verticalScrollHeight}`,
            pin: true,
            pinSpacing: true,
            onEnter: () => {
                // Enable vertical scrolling when entering last section
                document.body.style.overflowY = 'auto';
            },
            onLeaveBack: () => {
                // Disable vertical scrolling when leaving last section backwards
                document.body.style.overflowY = 'hidden';
            }
        });
    });

    // Mobile layout
    horizontalM.add("(max-width: 990px)", () => {
        // Reset any horizontal scroll settings
        ScrollTrigger.getAll().forEach(st => st.kill());
        gsap.set(".container", { clearProps: "all" });
        document.querySelector('.container').style.width = "100%";
        document.body.style.overflowY = 'auto';
    });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initImageExpansion();
    initHorizontalScroll();
});
