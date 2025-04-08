// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, Flip);

// window.addEventListener('load', () => {
//     setTimeout(matchHeights, 100); // Small delay to ensure others finish
//   });
//   window.addEventListener('resize', () => {
//     requestAnimationFrame(matchHeights); // Smooth resize handling
//   });

// function matchHeights() {
//   const section = document.querySelector('.sec6');
//   const div = document.querySelector('.wrapper');
//   const container = document.querySelector('.container')
  
//   // Reset height first to get natural content height
//   div.style.height = 'auto';
  
//   // Get section's computed height
//   const sectionHeight = section.offsetHeight;
  
//   // Apply to div
//   div.style.maxHeight = `${sectionHeight}px`;
//   container.style.height = `${sectionHeight}px`;

//   console.log('Section Height:', sectionHeight);
//   console.log('Div Height (after set):', div.offsetHeight);
//   console.log('Container height:', container.offsetHeight)
//   console.log('Section Element:', section);
//   console.log('Div Element:', div);

//   setTimeout(() => {
//     console.log('Final Div Height:', div.offsetHeight);
//   }, 1000);
//   setTimeout(() => {
//     console.log('Final con Height:', container.offsetHeight);
//   }, 1000);
// }

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
    // const priceItems = document.querySelectorAll('.price-item');
    // priceItems.forEach(item => {
    //     cursorManager.showCursorText(item, 'Book Now');
    // });
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
                    if (self.progress >= 1) {
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
            color: "orange",
            // backgroundPositionX: "0%",
            // stagger: 1,
            scrollTrigger: {
                trigger: "#sec2",
                containerAnimation: horizontalScroll,
                //markers: true,
                scrub: true,
                start: "left center",
                end: "+=800"
                // end: "90% left"
            }
            });
        
        //PROGRESS FILL
        gsap.to(".progress-bar", {
            width: "100%",
            ease: "none",
            scrollTrigger: {
                containerAnimation: horizontalScroll,
                trigger: ".scrollx",
                scrub: true,
                start: "left left",
                end: () => {
                    const scrollContainer = document.querySelector(".scrollx");
                    return "+=" + (scrollContainer.scrollWidth - window.innerWidth);
                },
                onUpdate: self => {
                    // Optional: Rocking effect to the boat.
                    gsap.to(".yacht-icon", {
                        rotation: Math.sin(self.progress * Math.PI * 6) * 8, // first value dictates how often, second value is the angle
                        duration: 0.1,
                    });}
            }});

        // Background parallax - moves slower than scroll
        gsap.to("#bg-parallax", {
            x: "10%", // Background moves at 20% of scroll speed
            ease: "none",
            scrollTrigger: {
                trigger: ".sec1",
                containerAnimation: horizontalScroll,
                scrub: true,
                start: "top top",
                end: "right left"
            }
        });

        gsap.to(".content-wrapper", {
            x: "-50%", // Background moves at 20% of scroll speed
            ease: "none",
            scrollTrigger: {
                trigger: ".sec1",
                containerAnimation: horizontalScroll,
                scrub: true,
                start: "top top",
                end: "right left"
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

// Cardflip in Section 4
document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const cardWrapper = document.querySelector('.card-wrapper');
    const flipArrow = document.querySelector('.flip-arrow');
    const flipBackArrow = document.querySelector('.flip-back-arrow');
    
    // Set initial GSAP states
    gsap.set('.front-face', { rotationY: 0 });
    gsap.set('.back-face', { rotationY: -180 });
    
    // Function to flip to the back
    function flipToBack() {
        gsap.to(cardWrapper, {
            rotationY: 180,
            duration: 0.8,
            ease: "power2.inOut"
        });
    }
    
    // Function to flip to the front
    function flipToFront() {
        gsap.to(cardWrapper, {
            rotationY: 0,
            duration: 0.5,
            ease: "power2.inOut"
        });
    }
    
    // Add event listeners
    flipArrow.addEventListener('click', flipToBack);
    flipBackArrow.addEventListener('click', flipToFront);
    
    // Optional: Add hover animation for the arrows
    gsap.to('.flip-arrow svg', {
        x: 3,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        paused: true
    });
    
    flipArrow.addEventListener('mouseenter', () => {
        gsap.to('.flip-arrow svg', { x: 3, duration: 0.3 });
    });
    
    flipArrow.addEventListener('mouseleave', () => {
        gsap.to('.flip-arrow svg', { x: 0, duration: 0.3 });
    });
    
    flipBackArrow.addEventListener('mouseenter', () => {
        gsap.to('.flip-back-arrow svg', { x: -3, duration: 0.3 });
    });
    
    flipBackArrow.addEventListener('mouseleave', () => {
        gsap.to('.flip-back-arrow svg', { x: 0, duration: 0.3 });
    });
});

//Book Now Button Section 1
window.addEventListener('DOMContentLoaded', () => {
    // Create a GSAP timeline for the button animation
    const buttonTimeline = gsap.timeline();
    const bookNowBtn = document.querySelector('.book-now-btn');
    const btnGlow = document.querySelector('.btn-glow');

    gsap.set(btnGlow, {
        width: bookNowBtn.offsetWidth * 1.1,
        height: bookNowBtn.offsetHeight * 1.1
    });
    
    // Initial button animation
    buttonTimeline
        // Rise up from the bottom of its container div while fading in
        .to('.book-now-container', {
            opacity: 1,
            y: 0, // Rise up to its normal position
            duration: 1.2,
            ease: 'power2.out'
        })
        // Add a subtle "pop" effect
        .to('.book-now-btn', {
            scale: 1.1,
            duration: 0.3,
            ease: 'back.out(1.7)'
        })
        .to('.book-now-btn', {
            scale: 1,
            duration: 0.2,
            ease: 'power2.out'
        });
        
    // Create a separate timeline for the continuous subtle pulse animation
    const pulseTimeline = gsap.timeline({
        repeat: -1,  // Infinite repetition
        repeatDelay: 2, // Delay between repeats
        delay: 1.5    // Start after the initial animation
    });
    
    pulseTimeline
        // Subtle glow effect
        .to('.btn-glow', {
            opacity: 0.8,
            duration: 0.8,
            ease: 'power1.inOut'
        })
        .to('.btn-glow', {
            opacity: 0,
            duration: 0.8,
            ease: 'power1.inOut'
        })
        // Very subtle scale animation
        .to('.book-now-btn', {
            scale: 1.03,
            duration: 0.8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: 1
        }, "-=1.6");
});




//Typewriter Effect
const phrases = ["Set Sail", "Luxury Awaits", "Explore the Seas"];
let phraseIndex = 0;
const typewriterElement = document.getElementById("typewriter");

function typePhrase(phrase, callback) {
  let i = 0;
  typewriterElement.textContent = ""; // Clear previous text

  function typeNextLetter() {
    if (i < phrase.length) {
      typewriterElement.textContent += phrase.charAt(i);
      i++;
      setTimeout(typeNextLetter, 100); // Speed of typing (100ms per letter)
    } else {
      setTimeout(callback, 2000); // Pause after typing (2 seconds)
    }
  }
  typeNextLetter();
}

function erasePhrase(callback) {
  let text = typewriterElement.textContent;

  function eraseNextLetter() {
    if (text.length > 0) {
      text = text.slice(0, -1);
      typewriterElement.textContent = text;
      setTimeout(eraseNextLetter, 50); // Speed of erasing (50ms per letter)
    } else {
      setTimeout(callback, 500); // Brief pause before next phrase (0.5 seconds)
    }
  }
  eraseNextLetter();
}

function startTypewriter() {
  const currentPhrase = phrases[phraseIndex % phrases.length];
  typePhrase(currentPhrase, () => {
    erasePhrase(() => {
      phraseIndex++;
      startTypewriter(); // Loop to next phrase
    });
  });
}

// Start the animation
startTypewriter();

// Tie it to your horizontal scroll with ScrollTrigger
// gsap.timeline({
//   scrollTrigger: {
//     trigger: "#sec5-5",
//     containerAnimation: horizontalScroll, // Your existing horizontal scroll animation
//     start: "left right",
//     end: "right left",
//     toggleActions: "play pause resume pause" // Play only when in view
//   }
// });





// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initImageExpansion();
    initHorizontalScroll();
    initScrollSnapping();
});
