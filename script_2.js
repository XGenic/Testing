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


//CURSOR IMAGE SWITCH//
const circle = document.getElementById('circle');
const expand = document.getElementById('expand');

function toggleCursor(isInImage) {
  if (isInImage) {
    gsap.to(circle, { scale: 0, duration: 0.1 });
    gsap.to(expand, { scale: 1, visibility: 'visible', duration: 0.1 });
  } else {
    gsap.to(circle, { scale: 1, duration: 0.1 });
    gsap.to(expand, { scale: 0, visibility: 'hidden', duration: 0.1 });
  }
}

const hoverImages = document.querySelectorAll('.hover-image');
hoverImages.forEach(image => {
  image.addEventListener('mouseenter', () => {
    toggleCursor(true);
  });

  image.addEventListener('mouseleave', () => {
    toggleCursor(false);
  });
});




