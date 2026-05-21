import { loadSlim } from '@tsparticles/slim';

/**
 * Registers the slim tsparticles bundle with the engine.
 * Pass this as the `init` prop to <ParticlesProvider> in App.jsx.
 */
export async function particlesInit(engine) {
  await loadSlim(engine);
}
