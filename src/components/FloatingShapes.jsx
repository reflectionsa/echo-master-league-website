/**
 * FloatingShapes — theme-aware ambient particle background.
 * Replaced custom CSS @keyframes with tsparticles (slim preset).
 * Requires <ParticlesProvider init={particlesInit}> as an ancestor.
 */
import { memo } from 'react';
import { Particles, useParticlesProvider } from '@tsparticles/react';

// Per-theme particle color palettes and shape vocabularies
const THEME_CONFIGS = {
  pink: {
    colors: ['#ff4d9d', '#ff80bf', '#c084fc', '#f0abfc', '#ff99cc', '#e040fb'],
    shapes: ['star', 'circle'],
  },
  tan: {
    colors: ['#c9a96e', '#d4b896', '#a08860', '#c9a040', '#e8d0a0', '#b09060'],
    shapes: ['square', 'polygon'],
  },
  blue: {
    colors: ['#1e6fff', '#38bdf8', '#00e5ff', '#818cf8', '#60a5fa', '#93c5fd'],
    shapes: ['circle', 'triangle'],
  },
  camo: {
    colors: ['#8aaa3a', '#aac85a', '#5a8a5a', '#7aaa7a', '#4a6a28', '#9ab050'],
    shapes: ['polygon', 'square'],
  },
  crimson: {
    colors: ['#dc143c', '#ff4d6d', '#ff0030', '#c084fc', '#f472b6', '#e0194a'],
    shapes: ['triangle', 'star'],
  },
  g2: {
    colors: ['#ff6b2b', '#00bfff', '#7c3aed', '#10b981', '#ef4444', '#a855f7'],
    shapes: ['circle', 'square', 'star'],
  },
};

const FloatingShapes = memo(({ colorScheme = 'g2', mode = 'dark' }) => {
  const { loaded } = useParticlesProvider();
  if (!loaded) return null;

  const cfg = THEME_CONFIGS[colorScheme] || THEME_CONFIGS.g2;
  const isLight = mode === 'light';

  const options = {
    fullScreen: { enable: true, zIndex: 2 },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
        resize: { enable: true },
      },
    },
    particles: {
      color: { value: cfg.colors },
      shape: { type: cfg.shapes },
      number: { value: 14, density: { enable: false } },
      opacity: {
        value: { min: 0.05, max: 0.1 },
        animation: { enable: false },
      },
      size: {
        value: { min: 15, max: 55 },
      },
      move: {
        enable: true,
        speed: { min: 0.2, max: 0.7 },
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'bounce' },
      },
      rotate: {
        value: { min: 0, max: 360 },
        animation: {
          enable: true,
          speed: 2,
          sync: false,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="eml-bg-particles"
      options={options}
      style={{
        mixBlendMode: isLight ? 'multiply' : 'screen',
        pointerEvents: 'none',
      }}
    />
  );
});

FloatingShapes.displayName = 'FloatingShapes';
export default FloatingShapes;


