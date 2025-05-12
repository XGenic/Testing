// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, Flip);

//LOADING SCREEN//
gsap.to("#loadingScreen", {
    duration: 3, // Set the duration of the animation
    y: "-100%", // Move the loading screen up to hide it
    ease: "expo.in", // Use ease for smooth animation
    onComplete: () => {
      // After animation is complete, show the main content
      document.getElementById("mainContent").style.display = "block";
    }
  });

//Tab Switch
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('#sec6 .tab-button'); // Scope to sec6
    const tabPanels = document.querySelectorAll('#sec6 .tab-panel');   // Scope to sec6
    const section6 = document.getElementById('sec6');

    if (!section6 || tabButtons.length === 0 || tabPanels.length === 0) {
        console.warn("Tab elements for section 6 not found.");
        return;
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('data-tab-target');
            const targetPanel = document.querySelector(targetPanelId);

            if (!targetPanel) return;

            // Deactivate all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Activate the clicked button and its corresponding panel
            button.classList.add('active');
            targetPanel.classList.add('active');

            // Crucial step: Refresh ScrollTrigger after the DOM has updated
            // and section 6 has potentially changed height.
            // Using a minimal timeout to ensure the browser has reflowed.
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                console.log(`ScrollTrigger refreshed due to tab switch. New sec6 offsetHeight: ${section6.offsetHeight}`);
            });
        });
    });
}



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
// const initScrollSnapping = () => {
//     const sections = gsap.utils.toArray("section");
//     const lastSection = sections[sections.length - 1];
//     let snapProgress = 0;
//     let lastScrollTime = 0;
//     const SCROLL_COOLDOWN = 500;

//     // Only apply scroll snapping to the last section (vertical scroll)
//     ScrollTrigger.create({
//         trigger: lastSection,
//         start: "top top",
//         end: "bottom bottom",
//         snap: 1
//     });
// };



function initHorizontalAndDynamicScroll() {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 991px)", () => { // Use your original breakpoint or adjust
        const wrapper = document.querySelector(".wrapper");
        const container = document.querySelector(".container");
        // Ensure you select direct children sections of .container
        const allSections = gsap.utils.toArray(".container > section");
        const sec6 = document.getElementById("sec6");

        if (!wrapper || !container || !sec6 || allSections.length === 0) {
            console.error("Essential scroll elements not found. Aborting horizontal scroll setup.");
            return;
        }

        const horizontalSections = allSections.slice(0, allSections.indexOf(sec6));
        if (horizontalSections.length === 0) {
             console.log("No horizontal sections found before sec6. Page will scroll vertically.");
             ScrollTrigger.refresh();
             return;
        }

        let horizontalTrackScrollWidth = 0;
        horizontalSections.forEach(s => {
            horizontalTrackScrollWidth += s.offsetWidth;
        });

        let totalContainerWidth = 0;
        allSections.forEach(s => {
            totalContainerWidth += s.offsetWidth;
        });
        container.style.width = totalContainerWidth + 'px';

        if (horizontalTrackScrollWidth === 0 && horizontalSections.length > 0) { // Added check for > 0
            console.warn("Horizontal sections have a combined width of 0. Horizontal scroll might not work as expected.");
        }

        const targetXTranslation = -horizontalTrackScrollWidth;
        const verticalScrollForHorizontalPart = horizontalTrackScrollWidth > window.innerWidth ?
                                              (horizontalTrackScrollWidth - window.innerWidth) : 0;

        const scrollBuffer = window.innerHeight * 0.7

        const horizontalTween = gsap.to(container, {
            x: targetXTranslation,
            ease: "none"
        });

        const mainST = ScrollTrigger.create({ // Gave it a variable name: mainST
            trigger: wrapper,
            pin: true,
            scrub: 0.7,
            start: "top top",
            end: () => `+=${verticalScrollForHorizontalPart + scrollBuffer}`,
            animation: horizontalTween,
            invalidateOnRefresh: true,
            // markers: true, // For debugging
            onUpdate: self => {
                const horizontalProgress = gsap.utils.clamp(0, 1, self.progress);
                // Progress Bar Update (see point 4 below)
                gsap.to(".progress-bar", {
                    width: `${horizontalProgress * 100}%`,
                    ease: "none"
                });
                gsap.to(".yacht-icon img", {
                    rotation: Math.sin(horizontalProgress * Math.PI * 10) * 8,
                    duration: 0.1,
                });
            },
            onLeave: () => {
                console.log("Horizontal pin ended.");
                gsap.to(".progress-bar", { width: "100%", ease: "none" });
            },
            onEnterBack: () => {
                 console.log("Re-entering horizontal pin area.");
            }
        });


        // #sec4 video animation
        if (document.getElementById('sec4')) {
            gsap.timeline({
                scrollTrigger: {
                    trigger: "#sec4",
                    containerAnimation: horizontalTween, // IMPORTANT CHANGE
                    start: 'left left', // Adjust as per your original logic
                    end: 'right right', // Adjust as per your original logic
                    scrub: true,
                }
            })
            .to(".video-section-component",{ xPercent: 100, ease: "none" }); // From your original

            gsap.timeline({
                scrollTrigger: {
                    trigger: '#sec4',
                    containerAnimation: horizontalTween, // IMPORTANT CHANGE
                    start: "5% left", // From your original
                    end: "right right", // From your original
                    scrub: true,
                }
            })
            .to (".video-container", { width: "100%", height: "100%", marginTop: 0 }) // From your original
            .to("#background-video", { width: "100%", height: "100%", marginTop: 0 }); // From your original

            gsap.timeline({
            scrollTrigger: {
                trigger: "#sec4",
                containerAnimation: horizontalTween, // IMPORTANT CHANGE
                start: "5% left", // From your original
                end: "15% left", // From your original
                scrub: true,
                }
            })
            .to(".video-heading", { y: "-50%", rotationX: "60_cw", opacity: 0, ease: "none" },0) // From your original
            .to(".video-section-bottom",{ y: "50%", rotationX: "-60_ccw", opacity: 0, ease: "none" },0); // From your original
        }

        // #sec2_sub text fill
        if (document.getElementById('sec2_sub')) {
            gsap.to("#sec2_sub", {
                color: "orange", // Or your original target
                scrollTrigger: {
                    trigger: "#sec2",
                    containerAnimation: horizontalTween, // IMPORTANT CHANGE
                    scrub: true,
                    start: "left center", // From your original
                    end: "+=800" // From your original
                }
            });
        }

        // #bg-parallax for sec1
        if (document.getElementById('bg-parallax')) {
            gsap.to("#bg-parallax", {
                x: "10%", // From your original
                ease: "none",
                scrollTrigger: {
                    trigger: ".sec1", // Or #sec1
                    containerAnimation: horizontalTween, // IMPORTANT CHANGE
                    scrub: true,
                    start: "top top", // From your original
                    end: "right left" // From your original
                }
            });
        }
         // .content-wrapper for sec1
        if (document.querySelector('.sec1 .content-wrapper')) {
            gsap.to(".sec1 .content-wrapper", { // Assuming .content-wrapper is inside .sec1
                x: "-50%", // From your original
                ease: "none",
                scrollTrigger: {
                    trigger: ".sec1", // Or #sec1
                    containerAnimation: horizontalTween, // IMPORTANT CHANGE
                    scrub: true,
                    start: "top top", // From your original
                    end: "right left" // From your original
                }
            });
        }


        // .sec5_text opacity
        if (document.querySelector('.sec5_text')) {
            gsap.to(".sec5_text",{
                opacity: '1',
                ease: 'none',
                scrollTrigger:{
                    trigger: ".sec5", // Or #sec5
                    containerAnimation: horizontalTween, // IMPORTANT CHANGE
                    scrub: true,
                    start: "left right", // From your original
                    end: "+=1000", // From your original
                }
            });
        }

        // book now button popup
        if (document.getElementById('book-now-button') && document.getElementById('sec2')) {
            gsap.to('.book-now-button',{
                bottom: '20px', // Or your desired final position
                ease: 'none',
                scrollTrigger:{
                    trigger: "#sec2", // Make sure #sec2 is a horizontal section
                    containerAnimation: horizontalTween, // IMPORTANT CHANGE
                    scrub: true,
                    start: "left right", // Your original start
                    end: "+=1300",       // Your original end
                }
            });
        }


        window.addEventListener('load', () => {
            console.log("Window loaded, refreshing ScrollTrigger for accurate final heights.");
            ScrollTrigger.refresh(true);
        });
        if (document.readyState === "complete") {
             console.log("Document already complete, refreshing ScrollTrigger.");
             ScrollTrigger.refresh(true);
        }

        console.log(`Horizontal Scroll Setup (Desktop): ...`); // Your console logs

        return () => {
            console.log("Cleaning up horizontal scroll GSAP (desktop).");
            if (mainST) mainST.kill(); // Kill the main ScrollTrigger
            if (horizontalTween) horizontalTween.kill();
            // Kill other ScrollTriggers created within this mm.add scope if necessary
            // Or use a more specific way to kill only related triggers
            gsap.utils.toArray(
                '#sec4 .scrollTrigger', // Example selector if you add classes to triggers
                '#sec2_sub .scrollTrigger',
                '#bg-parallax .scrollTrigger',
                '.sec1 .content-wrapper .scrollTrigger',
                '.sec5_text .scrollTrigger'
            ).forEach(st => st.kill());
        };
    }); // End of mm.add("(min-width: 991px)")
}



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
    initHorizontalAndDynamicScroll();
    initTabSwitching();
});
