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
    
    // Initialize special cursor text for interactive elements
    const bookNowButton = document.getElementById('book-now-button');
    if (bookNowButton) {
        cursorManager.showCursorText(bookNowButton, 'Adventure');
    }
    
    // Add cursor interaction for price list items
    const priceItems = document.querySelectorAll('.price-item');
    priceItems.forEach(item => {
        cursorManager.showCursorText(item, 'Book Now');
    });
};

// Shared cursor state management
const cursorManager = {
    circle: document.getElementById('circle'),
    expand: document.getElementById('expand'),
    isExpanded: false,

    showExpandCursor: (text) => {
        gsap.to(cursorManager.circle, { scale: 0, duration: 0.1 });
        cursorManager.expand.textContent = text;
        gsap.to(cursorManager.expand, { 
            scale: 1, 
            visibility: 'visible', 
            display: 'block',
            duration: 0.1 
        });
    },

    hideExpandCursor: () => {
        gsap.to(cursorManager.circle, { scale: 1, duration: 0.1 });
        gsap.to(cursorManager.expand, { 
            scale: 0, 
            visibility: 'hidden', 
            display: 'none',
            duration: 0.1 
        });
    },
    showCursorText: (element, text) => {
        element.addEventListener('mouseenter', () => {
            cursorManager.showExpandCursor(text);
        });
        element.addEventListener('mouseleave', () => {
            cursorManager.hideExpandCursor();
        });
    }
};

// Image Expansion
const initImageExpansion = () => {
    const container = document.getElementById('expanded-image-container');
    const expandedImg = document.getElementById('expanded-image');
    let currentScrollPosition = 0;

    const handleExpandedContainerHover = () => {
        cursorManager.showExpandCursor('Collapse');
    };

    const handleExpandedContainerLeave = () => {
        cursorManager.hideExpandCursor();
    };

    const expandImage = (img) => {
        currentScrollPosition = window.scrollY;
        
        const state = Flip.getState(img);
        expandedImg.src = img.getAttribute('data-full-img') || img.src;
        container.style.display = 'block';
        document.body.classList.add('no-scroll-transition');
        
        cursorManager.isExpanded = true;
        
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
        const state = Flip.getState(expandedImg);
        
        cursorManager.isExpanded = false;
        
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
            cursorManager.showExpandCursor('Expand');
        });
        
        image.addEventListener('mouseleave', () => {
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
                scrub: 0.7,
                //ENABLE BACK TO SNAP SECTIONS
                // snap: {
                //     snapTo: getSnapPoints(),
                //     duration: 1,
                //     ease: "power4.out",
                //     delay: 0,
                //     inertia: true
                // },
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
        
        //SECTION 4 ANIMATION
        gsap.timeline({
            scrollTrigger: {
                trigger: "#sec4",
                containerAnimation: horizontalScroll,
                start: 'left left',
                end: 'right right',
                scrub: true,
                //markers: true
            }
        })
        .to(".video-section-component",{
            xPercent: 100,
            ease: "none"
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: '#sec4',
                containerAnimation: horizontalScroll,
                start: "10% left",
                end: "right right",
                scrub: true,
                // markers: true,
            }
        })
        .to (".video-container", {
            width: "100%",
            height: "100%",
            marginTop: 0
        })
        .to("#background-video", {
            width: "100%",
            height: "100%",
            marginTop: 0
        });

        gsap.timeline({
        scrollTrigger: {
            trigger: "#sec4",
            containerAnimation: horizontalScroll,
            start: "10% left",
            end: "20% left",
            scrub: true,
            //markers: true
            }
        })
        .to(".video-heading", {
            y: "-50%",
            rotationX: "60_cw",
            opacity: 0,
            ease: "none"
            },0)
        .to(".video-section-bottom",{ 
            y: "50%", 
            rotationX: "-60_ccw", 
            opacity: 0, 
            ease: "none" 
            },0);
        //-----SECTION 4 END-------

        //Section 2 Text Fill
        gsap.to("#sec2_sub", {
            color: "blue",
            // backgroundPositionX: "0%",
            // stagger: 1,
            scrollTrigger: {
                trigger: "#sec2",
                containerAnimation: horizontalScroll,
                markers: true,
                scrub: false,
                start: "right right",
                // end: "90% left"
            }
            });
        
        // Update snap points on resize
        window.addEventListener("resize", () => {
            horizontalScroll.scrollTrigger.snap = getSnapPoints();
        });
    });
};

// JavaScript for the vertical banner with GSAP
document.addEventListener('DOMContentLoaded', () => {
    // Make sure GSAP is loaded
    if (typeof gsap === 'undefined') {
      console.error('GSAP is not loaded');
      return;
    }
  
    // Clone banner items to create a continuous loop
    const createInfiniteBanner = () => {
      const bannerContent = document.querySelector('.banner-content');
      const bannerItem = document.querySelector('.banner-item');
      
      if (!bannerContent || !bannerItem) return;
      
      // Calculate how many items we need to fill the banner
      // Get the viewport height
      const viewportHeight = window.innerHeight;
      const itemHeight = bannerItem.offsetHeight;
      
      // We need enough items to fill the screen at least twice (for seamless looping)
      const neededItems = Math.ceil((viewportHeight * 2) / itemHeight) + 2;
      
      // Clone the items
      for (let i = 0; i < neededItems; i++) {
        const clone = bannerItem.cloneNode(true);
        bannerContent.appendChild(clone);
      }
      
      // Set initial position
      gsap.set(bannerContent, { y: 0 });
      
      // Get the total height of all items for animation
      const totalHeight = bannerContent.offsetHeight / 2;
      
      // Create the infinite scroll animation
      gsap.to(bannerContent, {
        y: -totalHeight,
        duration: 20, // Adjust speed here (seconds for one complete cycle)
        ease: "none", // Linear movement
        repeat: -1, // Infinite repeat
        onRepeat: () => {
          // Reset position when repeating (optional, the animation handles looping)
          // gsap.set(bannerContent, { y: 0 });
        }
      });
    };
    
    // Initialize after a short delay to ensure DOM is ready
    setTimeout(createInfiniteBanner, 500);
    
    // Update on window resize (optional but helps with responsiveness)
    window.addEventListener('resize', () => {
      // Cancel existing animation
      gsap.killTweensOf('.banner-content');
      
      // Remove all cloned items
      const bannerContent = document.querySelector('.banner-content');
      const bannerItems = document.querySelectorAll('.banner-item');
      
      // Keep the first item, remove the rest
      for (let i = 1; i < bannerItems.length; i++) {
        bannerContent.removeChild(bannerItems[i]);
      }
      
      // Recreate the banner
      createInfiniteBanner();
    });
});


// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initImageExpansion();
    initHorizontalScroll();
    initScrollSnapping();
});
