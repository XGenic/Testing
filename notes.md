# Project Notes - Horizontal Scrolling Image Gallery

## Project Context
This project is inspired by another website, with `example.html` and `wtf.js` serving as reference files for our implementation. We're building a modern, interactive website with horizontal scrolling sections and an engaging image gallery.

## Core Technologies & Plugins
- **GSAP (GreenSock Animation Platform)**
  - ScrollTrigger - For scroll-based animations and horizontal scrolling
  - Flip - For smooth image expansion animations
  - ScrollToPlugin - For smooth scrolling behavior
  - MotionPathPlugin - For advanced animation paths
  - TextPlugin - For text animations

- **jQuery** - Used for some DOM manipulation and event handling

## Current Implementation

### Navigation & Scrolling
- Horizontal scrolling for main content sections
- Snap points for each section
- Special vertical scrolling behavior for the last section
- Responsive design with mobile considerations (switches to vertical layout under 991px)

### Image Gallery (Section 3)
- Grid layout with:
  - Two tall images (30% width each)
  - Two center stacked images (40% width combined)
- Interactive features:
  - Hover effects with scaling (1.05)
  - Description labels that follow cursor vertically (2%-98% bounds)
  - Full viewport image expansion with GSAP Flip
  - Custom cursor states ("Expand"/"Collapse")

### Cursor System
- Custom cursor implementation with two states:
  - Default circle
  - Text indicator for interactive elements
- Centralized cursor management through `cursorManager`
- Smooth transitions using GSAP animations

## Planned Implementations
1. Sections to be completed:
   - Section 4 (Video section)
   - Section 5
   - Section 6
   - Section 7

2. Additional features discussed:
   - Smooth transitions between sections
   - Enhanced mobile responsiveness
   - Loading animations
   - Navigation indicators

## File Structure
- `index.html` - Main structure and content
- `style.css` - Styling and animations
- `script.js` - Core functionality and interactions
- Reference files:
  - `example.html` - Original inspiration site structure
  - `wtf.js` - Original inspiration site functionality

## Current Progress
- ✅ Basic horizontal scrolling
- ✅ Section snapping
- ✅ Image gallery grid layout
- ✅ Image expansion system
- ✅ Cursor interaction system
- ✅ Description hover effects

## Notes on Implementation Details
- Using GSAP's matchMedia for responsive behavior
- Scroll position preservation during image expansion
- Careful management of z-index and stacking contexts
- Performance considerations in animation timings
- Event listener cleanup to prevent memory leaks

## Known Considerations
- Need to maintain smooth performance with multiple GSAP animations
- Mobile experience needs special attention for touch interactions
- Image loading optimization might be needed for larger galleries
- Consider browser compatibility, especially for newer CSS features 