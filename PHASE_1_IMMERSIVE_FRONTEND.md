# Phase 1: Immersive Frontend - Implementation Guide

## Overview
Phase 1 introduces three major immersive frontend enhancements to create a premium, interactive user experience:

1. **Hidden-Until-Scroll Glassmorphism Navigation**
2. **Custom Spotlight Cursor**
3. **Hover-to-Video Product Cards with Smooth Scrolling**

---

## 1. Hidden-Until-Scroll Glassmorphism Navigation

### What Changed
The navigation has been upgraded from a static header to a sophisticated "hidden-until-scroll" system with enhanced glassmorphic effects.

### Features
- **Hidden by Default**: Navigation appears only when user scrolls down past 100px
- **Smart Hide on Scroll Down**: Nav hides again when user scrolls downward
- **Glassmorphism**: Enhanced blur effect with saturated backdrop filter
- **Smooth Animations**: 0.3s duration with easing function
- **Responsive Design**: Works seamlessly on mobile and desktop

### How It Works
```typescript
// The navbar detects scroll direction
const currentScrollY = window.scrollY
const isScrolledDown = currentScrollY > 100

// Shows nav if scrolled AND scrolling up
if (scrolled && !isScrollingDown) {
  // Show nav with animation
}
```

### Component Location
- **File**: [components/layout/Navbar.tsx](components/layout/Navbar.tsx)
- **New State Variables**:
  - `isScrollingDown` - Tracks scroll direction
  - `lastScrollY` - Stores previous scroll position

### Styling
Enhanced glassmorphism in `globals.css`:
```css
.glass {
  background: rgba(249, 249, 249, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

## 2. Custom Spotlight Cursor

### What Changed
The default cursor is now hidden and replaced with an animated spotlight effect that creates an immersive, elegant browsing experience.

### Features
- **Spotlight Rings**: Concentric circles that follow the cursor
- **Interactive States**: Scales up when hovering over clickable elements
- **Mix Blend Mode**: Uses `mix-blend-screen` for subtle light effect
- **Performance Optimized**: Uses Framer Motion for smooth 60fps animations
- **Accessibility**: Respects `prefers-reduced-motion` setting

### Component Hierarchy
```
CustomCursor Component
├── Outer Glow Ring (border)
├── Middle Glow Ring (border)
├── Inner Dot (filled)
└── Spotlight Gradient (radial-gradient)
```

### Implementation
**File**: [components/ui/CustomCursor.tsx](components/ui/CustomCursor.tsx)

**State Tracking**:
- `position` - Current mouse coordinates
- `isVisible` - Whether cursor is in viewport
- `isPointing` - Whether hovering over interactive element

**Event Listeners**:
```javascript
// Tracks all interactions
window.addEventListener('mousemove', handleMouseMove)
window.addEventListener('mouseenter', handleMouseEnter)
window.addEventListener('mouseleave', handleMouseLeave)
window.addEventListener('mouseover', handleMouseOver)
```

**Interactive Detection** (Auto-scales for):
- Links (`<a>` tags)
- Buttons (`<button>` tags)
- Elements with `.interactive` class
- Form inputs

### Usage in App
The CustomCursor is automatically mounted in the Providers component:
```typescript
<Providers>
  <CustomCursor /> {/* Automatically included */}
  {/* rest of app */}
</Providers>
```

### Browser Support
- Modern browsers with CSS `mix-blend-mode` support
- Falls back gracefully on older browsers
- Works on desktop (cursor hidden on mobile by default)

---

## 3. Hover-to-Video Product Cards

### What Changed
Product cards now feature intelligent hover-to-video transitions. When users hover over a product, a 3-second video loop elegantly fades in to showcase the product in motion.

### Features
- **Seamless Fade Transition**: 0.3s opacity transition
- **Auto Play/Pause**: Videos play on hover, pause on mouse leave
- **Looping 3-Sec Videos**: Perfect for product demonstrations
- **Fallback to Image**: If video fails, shows product image
- **Play Indicator**: Animated play icon appears during video
- **Performance**: Uses `muted` and lazy loading for optimization

### Component Updates
**File**: [components/shop/ProductCard.tsx](components/shop/ProductCard.tsx)

**New Props**:
```typescript
interface ProductCardProps {
  product: Product & { videoUrl?: string }
  index?: number
}
```

**How Video Hover Works**:
1. User hovers over product card
2. `handleMouseEnter` triggers
3. Video reference plays with `videoRef.current.play()`
4. Opacity fades from image → video
5. Play icon animates at center
6. On mouse leave, video pauses and resets

**Video Implementation**:
```typescript
{hasVideo && (
  <motion.video
    ref={videoRef}
    loop
    muted
    onLoadedData={() => setVideoLoaded(true)}
    animate={{
      opacity: isHovering ? 1 : 0,
    }}
  >
    <source src={videoUrl} type="video/mp4" />
  </motion.video>
)}
```

### Video Setup Instructions

#### 1. Database Schema Update
In `prisma/schema.prisma`, add video field to Product model:
```prisma
model Product {
  // ... existing fields
  videoUrl    String?     // Path to 3-second demo video
}
```

#### 2. Video Storage
Place product demo videos in:
```
public/videos/
├── product-[productId].mp4
└── product-demo.mp4  // Fallback
```

#### 3. Update Seed Data
In `prisma/seed.ts`, add video URLs:
```typescript
{
  name: 'Product Name',
  videoUrl: '/videos/product-[id].mp4',
  // ... other fields
}
```

#### 4. Video Specifications
- **Duration**: 3 seconds (optimal)
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080p minimum for desktop
- **File Size**: <2MB (for fast loading)
- **Codec**: H.264 video + AAC audio
- **Frame Rate**: 30fps

#### 5. Demo Mode
For testing without videos, the component randomly enables videos:
```typescript
const hasVideo = product.videoUrl || Math.random() > 0.5 // 50% random
```

Remove the random check in production:
```typescript
const hasVideo = !!product.videoUrl
```

---

## 4. Smooth Scrolling with Lenis

### What Added
Lenis library provides buttery-smooth scrolling experience with natural momentum and easing.

### Package Added
```json
"lenis": "^1.1.9"
```

### Component: LenisProvider
**File**: [components/layout/LenisProvider.tsx](components/layout/LenisProvider.tsx)

**Configuration**:
```typescript
const lenis = new Lenis({
  duration: 1.2,           // Scroll duration in seconds
  easing: easeOutExpo,     // Easing function
  direction: 'vertical',
  smooth: true,
  smoothTouch: false,      // Disable on touch (prevents conflict)
  touchMultiplier: 2,      // Touch scroll multiplier
})
```

**RAF Loop**:
```javascript
const onAnimationFrame = (time: number) => {
  lenis.raf(time)
  requestAnimationFrame(onAnimationFrame)
}
```

### Usage
Automatically integrated in app via Providers:
```typescript
<Providers>
  <LenisProvider>
    {/* App content */}
  </LenisProvider>
</Providers>
```

---

## 5. Staggered Text Reveal Animations

### New Animation Library
**File**: [lib/animations.ts](lib/animations.ts)

Includes pre-built Framer Motion variants:

#### Core Animations
- **`staggerContainer`**: Parent container for staggered children
- **`staggerItem`**: Individual item with 0.1s stagger delay
- **`textReveal`**: Text fade-in with 10px upward movement
- **`fadeInUp`**: General fade and upward animation
- **`scaleIn`**: Scale from 0.9 to 1
- **`slideInFromLeft/Right`**: Side slide animations
- **`character`**: Individual character reveal

#### Usage Example
```typescript
import { staggerContainer, staggerItem } from '@/lib/animations'

<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="show"
>
  <motion.h1 variants={staggerItem}>
    Heading
  </motion.h1>
  <motion.p variants={staggerItem}>
    Description
  </motion.p>
</motion.div>
```

### Updated Components Using Animations
1. **HeroSection** - All text elements now stagger on load
2. **ProductCard** - Cards fade in with staggered timing
3. **Navigation** - Menu items animate with delay

---

## 6. Global CSS Enhancements

### Updated Styles
- **Cursor**: Set to `none` globally to hide default cursor
- **HTML**: Changed from `scroll-behavior: smooth` to `auto` (Lenis handles it)
- **Glassmorphism**: Enhanced with saturated backdrop filter
- **Video**: Default styles for smooth object-fit
- **Accessibility**: Added `prefers-reduced-motion` rule

### New CSS Rules
```css
/* Hide default cursor */
body { cursor: none; }

/* Interactive elements */
a, button, input, select, textarea {
  cursor: none; /* Custom cursor everywhere */
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Dependencies Added

### New Package
```json
"lenis": "^1.1.9"
```

### Run Installation
```bash
npm install
# or
yarn install
```

---

## Performance Considerations

### Optimization Techniques
1. **Cursor**: Uses `mix-blend-mode` for GPU acceleration
2. **Videos**: Muted and lazy-loaded for performance
3. **Animations**: GPU-accelerated with Framer Motion
4. **Scrolling**: Lenis uses requestAnimationFrame for smooth 60fps
5. **Mobile**: Smooth scroll disabled on touch devices

### Recommendations
- **Preload Videos**: Use `<link rel="preload">` for important videos
- **Compress Videos**: Use FFmpeg to compress videos to <2MB
- **CDN Delivery**: Serve videos from CDN for faster loading
- **Fallback Images**: Always have high-quality fallback images

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Mobile |
|---------|--------|---------|--------|--------|
| Smooth Scrolling (Lenis) | ✅ | ✅ | ✅ | ⚠️ |
| Custom Cursor | ✅ | ✅ | ✅ | ❌ |
| Video Hover | ✅ | ✅ | ✅ | ⚠️ |
| Glassmorphism | ✅ | ✅ | ✅ | ✅ |

**Notes**:
- Mobile devices hide custom cursor automatically
- Touch devices disable smooth scroll to prevent conflicts
- All features degrade gracefully on older browsers

---

## Testing Checklist

### Desktop Testing
- [ ] Glassmorphic nav hides/shows correctly on scroll
- [ ] Custom cursor appears and scales on interactive elements
- [ ] Product videos play smoothly on hover
- [ ] Smooth scrolling feels natural and responsive
- [ ] Text animations stagger correctly on page load

### Mobile Testing
- [ ] Navigation hidden-hide works on mobile
- [ ] Bottom nav appears correctly
- [ ] Custom cursor hidden on mobile (not visible)
- [ ] Touch interactions work smoothly
- [ ] Videos load without performance issues

### Accessibility Testing
- [ ] `prefers-reduced-motion` disables animations
- [ ] Keyboard navigation works (Tab key)
- [ ] Screen readers can read content
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG standards

---

## Troubleshooting

### Issue: Videos don't play on hover
**Solution**: 
- Ensure video URLs are correct
- Check video codec (must be H.264)
- Add CORS headers if videos hosted externally
- Test video in browser directly

### Issue: Custom cursor not showing
**Solution**:
- Clear browser cache
- Check `globals.css` has `cursor: none`
- Ensure CustomCursor component is mounted
- Check for browser extensions interfering

### Issue: Smooth scroll feels janky
**Solution**:
- Reduce animation duration in LenisProvider
- Disable smooth scroll on low-end devices
- Profile with Chrome DevTools Performance tab
- Check for heavy animations during scroll

### Issue: Videos not looping smoothly
**Solution**:
- Ensure videos loop attribute is present
- Check video duration (3-5 seconds optimal)
- Use same format/codec for all videos
- Add small delay before loop restart

---

## Future Enhancements

### Phase 2 Ideas
- [ ] 3D product viewer with rotation
- [ ] Mouse-follow animations
- [ ] Parallax scrolling effects
- [ ] Audio integration with videos
- [ ] Gesture controls for mobile
- [ ] Advanced filter animations
- [ ] Product card flip animations

### Performance Phase
- [ ] Video lazy loading with Intersection Observer
- [ ] Image optimization with AVIF format
- [ ] Code splitting for animation libraries
- [ ] Service workers for video caching

---

## File Reference Summary

### New Files Created
```
components/
├── ui/
│   └── CustomCursor.tsx (NEW)
└── layout/
    └── LenisProvider.tsx (NEW)

lib/
└── animations.ts (NEW)
```

### Modified Files
```
components/
├── shop/
│   ├── ProductCard.tsx (UPDATED - hover-to-video)
│   └── HeroSection.tsx (UPDATED - staggered text)
└── layout/
    ├── Navbar.tsx (UPDATED - hidden-until-scroll)
    └── Providers.tsx (UPDATED - added Lenis + Cursor)

app/
└── globals.css (UPDATED - cursor, lenis, video styles)

package.json (UPDATED - added lenis)
```

---

## Developer Notes

### Key Concepts
1. **Glassmorphism**: Combining blur, transparency, and borders for frosted glass effect
2. **Spotlight Cursor**: Custom element positioned at mouse coordinates with blend modes
3. **Hover-to-Video**: Conditional rendering with opacity animation for smooth transitions
4. **Staggered Animations**: Parent-child variants in Framer Motion for sequential reveals

### Best Practices Applied
- ✅ Performance optimizations (GPU acceleration)
- ✅ Accessibility considerations (reduced motion)
- ✅ Mobile-first responsive design
- ✅ Graceful degradation for older browsers
- ✅ Semantic HTML and proper event handling
- ✅ Type safety with TypeScript

---

*Last Updated: April 2026*
*Phase: 1 - Immersive Frontend*
