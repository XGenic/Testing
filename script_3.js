//https://www.one24.pt///
//https://codepen.io/designcourse/pen/gOjZKOO//


//CURSOR LEAVE/ENTER ANIMATION//
jQuery(document).mouseleave(function(){
  gsap.to(".cursor", {scale: 0, duration: 0.1})});

jQuery(document).mouseenter(function(){
  gsap.to(".cursor", {scale: 1, duration: 0.1})});

//CURSOR FOLLOW//
gsap.set(".cursor", { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2});

let xTo = gsap.quickTo(".cursor", "x", { duration: 0.15, ease: "power3"}),
    yTo = gsap.quickTo(".cursor", "y", { duration: 0.15, ease: "power3"});

window.addEventListener("mousemove", e => {
  xTo(e.clientX);
  yTo(e.clientY);
});


// CURSOR IMAGE SWITCH
const circle = document.getElementById('circle');
const expand = document.getElementById('expand');
const expandedImageContainer = document.getElementById('expanded-image-container');
const expandedImage = document.getElementById('expanded-image');

function toggleCursor(isInImage, isExpanded) {
  if (isInImage) {
    gsap.to(circle, { scale: 0, duration: 0.1 });
    gsap.to(expand, { scale: 1, visibility: 'visible', duration: 0.1 });
    expand.textContent = isExpanded ? 'Shrink' : 'Expand';
  } else {
    gsap.to(circle, { scale: 1, duration: 0.1 });
    gsap.to(expand, { scale: 0, visibility: 'hidden', duration: 0.1 });
  }
}

const expandableImages = document.querySelectorAll('.expandable-image');
let currentExpandedImage = null;

function growImage(image) {
  const rect = image.getBoundingClientRect();
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  expandedImage.src = image.src;
  expandedImageContainer.style.display = 'block';

  gsap.set(expandedImage, {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    opacity: 0.2
  });

  gsap.to(expandedImageContainer, {
    duration: 0.6,
    backgroundColor: 'rgba(0,0,0,0.8)',
  });

  gsap.to(expandedImage, {
    duration: 0.6,
    x: 0,
    y: 0,
    width: windowWidth,
    height: windowHeight,
    opacity: 1,
    ease: 'power2.inOut',
    onComplete: () => {
      // After the animation, switch to the full image
      expandedImage.src = image.dataset.fullImg;
    }
  });

  currentExpandedImage = image;
}

function shrinkImage() {
  if (currentExpandedImage) {
    const rect = currentExpandedImage.getBoundingClientRect();

    // Switch back to the cropped image before shrinking
    expandedImage.src = currentExpandedImage.src;

    gsap.to(expandedImageContainer, {
      duration: 0.6,
      backgroundColor: 'rgba(0,0,0,0)',
    });

    gsap.to(expandedImage, {
      duration: 0.6,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      opacity: 0.05,
      ease: 'power2.inOut',
      onComplete: () => {
        expandedImageContainer.style.display = 'none';
        currentExpandedImage = null;
        toggleCursor(false);
      }
    });
  }
}

expandableImages.forEach(image => {
  image.addEventListener('mouseenter', () => {
    toggleCursor(true, image === currentExpandedImage);
  });

  image.addEventListener('mouseleave', () => {
    toggleCursor(false);
  });

  image.addEventListener('click', (e) => {
    e.stopPropagation();
    if (image === currentExpandedImage) {
      shrinkImage();
    } else {
      growImage(image);
    }
    toggleCursor(true, image !== currentExpandedImage);
  });
});

expandedImageContainer.addEventListener('click', (e) => {
  if (e.target === expandedImageContainer || e.target === expandedImage) {
    shrinkImage();
  }
});

// Add this to handle cursor text change when hovering over the expanded image
expandedImage.addEventListener('mouseenter', () => {
  toggleCursor(true, true);
});

expandedImage.addEventListener('mouseleave', () => {
  toggleCursor(false);
});



//TODO:
//When expanding images, they quickly go into uncropped state, before expanding outwords. Looks not good.