/**
 * ParticlePulseDot — live indicator using tsparticles.
 * Replaces the CSS .eml-live-dot + ::before pulse-ring animation.
 * Requires <ParticlesProvider> as an ancestor (provided by App.jsx).
 */
import { memo, useRef } from 'react';
import { Particles, useParticlesProvider } from '@tsparticles/react';

let _dotCounter = 0;

const PULSE_OPTIONS = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  interactivity: {
    events: { onHover: { enable: false }, onClick: { enable: false } },
  },
  particles: {
    color: { value: '#ef4444' },
    shape: { type: 'circle' },
    number: { value: 0 },
    opacity: {
      value: { min: 0, max: 0.85 },
      animation: {
        enable: true,
        speed: 1.2,
        sync: false,
        startValue: 'max',
        destroy: 'min',
      },
    },
    size: {
      value: { min: 2, max: 6 },
      animation: {
        enable: true,
        speed: 4,
        sync: false,
        startValue: 'min',
        destroy: 'max',
      },
    },
    move: {
      enable: true,
      speed: { min: 0.5, max: 1.5 },
      direction: 'none',
      random: true,
      straight: false,
      outModes: { default: 'destroy' },
    },
  },
  emitters: {
    position: { x: 50, y: 50 },
    rate: { delay: 0.4, quantity: 2 },
    size: { width: 0, height: 0 },
    life: {},
  },
  detectRetina: false,
};

const ParticlePulseDot = memo(({ size = 10 }) => {
  const idRef = useRef(null);
  if (idRef.current === null) {
    idRef.current = `eml-pulse-${++_dotCounter}`;
  }
  const { loaded } = useParticlesProvider();

  // Fallback to a simple red dot while engine loads
  if (!loaded) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#ef4444',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {/* Static center dot */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#ef4444',
          zIndex: 1,
        }}
      />
      {/* Particle burst canvas */}
      <Particles
        id={idRef.current}
        options={PULSE_OPTIONS}
        style={{
          position: 'absolute',
          inset: -size * 1.5,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
    </span>
  );
});

ParticlePulseDot.displayName = 'ParticlePulseDot';
export default ParticlePulseDot;

