export const animations = {
  // Timing presets
  timing: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  
  // Easing presets
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  },
  
  // Common animation configurations
  fade: {
    duration: 300,
    easing: 'ease-in-out'
  },
  
  slide: {
    duration: 250,
    easing: 'ease-out'
  },
  
  scale: {
    duration: 200,
    easing: 'ease-in-out'
  },
  
  bounce: {
    duration: 400,
    easing: 'ease-out'
  }
};

export type Animations = typeof animations;