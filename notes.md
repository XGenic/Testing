# Horizontal Scroll Position Issue Documentation

## Problem Description
When expanding and collapsing images in a horizontally scrolling website, we're experiencing issues with scroll position restoration and animation state management. The main symptoms are:

1. After collapsing an image, the page jerks forward and resets to the beginning
2. Loss of scrolling ability after collapse
3. Inconsistent ScrollTrigger state restoration

## Technical Details

### Initial State (Before Expand)
- ScrollY: 2001
- Container Transform: translate3d(-2000.98px, 0px, 0px)
- ScrollTrigger Instances: 9
- Active Section: Section 3 (shown by ScrollTrigger #3 being active)

### State After Expand
- ScrollY maintains at 2001
- Container Transform slightly shifts to -2001px
- ScrollTrigger states remain consistent
- All animation instances preserved

### State After Collapse
- ScrollY shows correct value (2001)
- Container Transform shows correct value (-2001px)
- ScrollTrigger instances reduced to 8
- All section triggers become undefined/inactive
- Main wrapper trigger remains active but loses some properties

## Attempted Solutions

### 1. Basic Position Restoration
- Stored scroll position and transform state before collapse
- Attempted to restore using window.scrollTo
- **Result**: Failed - Page still jerked to beginning

### 2. ScrollTrigger State Preservation
- Stored complete ScrollTrigger states including:
  - Progress
  - Active state
  - Direction
  - Animation state
- Attempted to recreate exact states after reinitialization
- **Result**: States stored but not properly restored

### 3. Transform Management
- Used more precise regex for transform extraction
- Stored exact pixel positions
- Attempted to force position multiple times
- **Result**: Position values correct but not properly applied

### 4. Timing Adjustments
- Added delays for position restoration
- Used setTimeout instead of requestAnimationFrame
- Multiple position enforcement points
- **Result**: Timing improved but core issue persisted

### 5. ScrollTrigger Reinitialization
- Killed and recreated ScrollTrigger instances
- Attempted to preserve scroll state during transition
- Added scroll prevention during reinitialization
- **Result**: Clean reinitialization but position still resets

## Current State
The issue appears to be related to how GSAP's ScrollTrigger handles state restoration after reinitialization. While we can preserve the values (scroll position, transform state, etc.), the actual application of these values isn't sticking.

## Key Observations
1. ScrollTrigger states are not fully transferable between instances
2. Transform values are correct but not being applied consistently
3. Scroll position shows correct in logs but visually resets
4. Section states (active/inactive) are not properly preserved

## Potential Next Steps
1. Investigate GSAP's internal scroll memory management
2. Consider alternative approaches to image expansion that don't require ScrollTrigger reinitialization
3. Look into using GSAP's context system for better state isolation
4. Consider implementing a custom scroll position management system

## Console Output Analysis
The console logs show that while we're maintaining the correct values in our state objects, something in the ScrollTrigger initialization process is causing the position to reset despite our attempts to prevent it. The reduction in ScrollTrigger instances (9 to 8) and loss of section states suggests the reinitialization process isn't fully preserving the scroll ecosystem. 