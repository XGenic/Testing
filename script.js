// gsap.set(".circle", {xPercent: -50, yPercent: -50});

// let targets = gsap.utils.toArray(".circle"); 

// window.addEventListener("mousemove", e => {
//     gsap.to(targets, {
//       duration: 0.08,
//       x: e.pageX,
//       y: e.pageY,
//       ease: "none",
//       overwrite: "auto",
//       stagger: 0.012,
//     });
//   });

gsap.set(".circle", {xPercent: -50, yPercent: -50});

// let targets = gsap.utils.toArray(".circle"); 
let xTo = gsap.quickTo(".circle", "x", {duration: 0.2, ease: "power3"}),
    yTo = gsap.quickTo(".circle", "y", {duration: 0.2, ease: "power3"});

window.addEventListener("mousemove", e => {
  // xTo(e.pageX);
  // yTo(e.pageY);
  xTo(e.clientX);
  yTo(e.clientY);
});



// gsap.set(".button", {xPercent: -50, yPercent: -50});

// // let targets = gsap.utils.toArray(".circle"); 
// let xTo = gsap.quickTo(".button", "x", {duration: 0.2, ease: "power3"}),
//     yTo = gsap.quickTo(".button", "y", {duration: 0.2, ease: "power3"});

// window.addEventListener("mousemove", e => {
//   // xTo(e.pageX);
//   // yTo(e.pageY);
//   xTo(e.clientX);
//   yTo(e.clientY);
// });
