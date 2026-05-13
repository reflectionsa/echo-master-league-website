/**
 * FloatingShapes — theme-aware ambient animated shapes.
 * Each color scheme gets its own shape vocabulary:
 *   pink    → hearts & petals
 *   tan     → bricks & cylinders
 *   blue    → water drops & crescents
 *   camo    → blobs & irregular polygons
 *   crimson → octagons & triangles
 *   g2      → squares & spheres
 */

// Shared positions/timings — only shape type & color change per theme
const BASE_POSITIONS = [
  { left: 5,  top: 12, size: 90,  dur: 20, delay: 0,   opacity: 0.09, anim: 'a' },
  { left: 88, top: 18, size: 44,  dur: 14, delay: -3,  opacity: 0.08, anim: 'b' },
  { left: 48, top: 4,  size: 65,  dur: 22, delay: -7,  opacity: 0.07, anim: 'drift' },
  { left: 73, top: 68, size: 38,  dur: 16, delay: -5,  opacity: 0.08, anim: 'a' },
  { left: 18, top: 78, size: 100, dur: 24, delay: -2,  opacity: 0.07, anim: 'b' },
  { left: 62, top: 42, size: 55,  dur: 17, delay: -9,  opacity: 0.08, anim: 'drift' },
  { left: 33, top: 58, size: 32,  dur: 12, delay: -4,  opacity: 0.09, anim: 'a' },
  { left: 8,  top: 48, size: 50,  dur: 19, delay: -6,  opacity: 0.07, anim: 'b' },
  { left: 80, top: 43, size: 58,  dur: 18, delay: -1,  opacity: 0.08, anim: 'drift' },
  { left: 14, top: 28, size: 75,  dur: 21, delay: -8,  opacity: 0.06, anim: 'a' },
  { left: 44, top: 84, size: 28,  dur: 13, delay: -3,  opacity: 0.09, anim: 'b' },
  { left: 68, top: 10, size: 68,  dur: 26, delay: -11, opacity: 0.07, anim: 'drift' },
  { left: 25, top: 92, size: 42,  dur: 15, delay: -5,  opacity: 0.08, anim: 'a' },
  { left: 55, top: 72, size: 30,  dur: 23, delay: -7,  opacity: 0.07, anim: 'b' },
];

const THEME_CONFIGS = {
  pink: {
    seq:     ['heart','petal','heart','petal','heart','petal','heart','petal','heart','petal','heart','petal','heart','petal'],
    palette: ['#ff4d9d','#ff80bf','#ff2d78','#c084fc','#f0abfc','#ff99cc','#e040fb','#ff6eb4'],
  },
  tan: {
    seq:     ['rect','cylinder','rect','cylinder','rect','cylinder','rect','cylinder','rect','cylinder','rect','cylinder','rect','cylinder'],
    palette: ['#c9a96e','#d4b896','#a08860','#7a9e8e','#c9a040','#e8d0a0','#8a6840','#b09060'],
  },
  blue: {
    seq:     ['waterdrop','crescent','waterdrop','crescent','waterdrop','crescent','waterdrop','crescent','waterdrop','crescent','waterdrop','crescent','waterdrop','crescent'],
    palette: ['#1e6fff','#38bdf8','#00e5ff','#818cf8','#60a5fa','#93c5fd','#0ea5e9','#a5b4fc'],
  },
  camo: {
    seq:     ['blob','irregular','blob','irregular','blob','irregular','blob','irregular','blob','irregular','blob','irregular','blob','irregular'],
    palette: ['#8aaa3a','#aac85a','#5a8a5a','#7aaa7a','#6a7a3a','#4a6a28','#9ab050','#3a6a3a'],
  },
  crimson: {
    seq:     ['octagon','triangle','octagon','triangle','octagon','triangle','octagon','triangle','octagon','triangle','octagon','triangle','octagon','triangle'],
    palette: ['#dc143c','#ff4d6d','#ff0030','#c084fc','#f472b6','#ff6080','#e0194a','#d040a0'],
  },
  g2: {
    seq:     ['square','sphere','square','sphere','square','sphere','square','sphere','square','sphere','square','sphere','square','sphere'],
    palette: ['#ff6b2b','#00bfff','#7c3aed','#10b981','#ef4444','#ff8c42','#00e5ff','#a855f7'],
  },
};

const ShapeEl = ({ pos, type, color, index }) => {
  const animClass =
    pos.anim === 'a' ? 'eml-shape eml-shape-float-a' :
    pos.anim === 'b' ? 'eml-shape eml-shape-float-b' :
                       'eml-shape eml-shape-drift';

  const s = pos.size;
  const base = {
    left: `${pos.left}%`,
    top: `${pos.top}%`,
    opacity: pos.opacity,
    '--dur': `${pos.dur}s`,
    '--delay': `${pos.delay}s`,
  };

  switch (type) {
    case 'heart':
      return (
        <svg
          className={animClass}
          style={{ ...base, width: s, height: s }}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path
            d="M50,30 C50,27 47,18 36,18 C18,18 18,42 18,42 C18,56 32,68 50,82 C68,68 82,56 82,42 C82,42 82,18 64,18 C53,18 50,27 50,30 Z"
            fill={color}
          />
        </svg>
      );

    case 'petal': {
      const angle = (index * 51) % 360;
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s * 0.55,
            height: s,
            background: color,
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            transform: `rotate(${angle}deg)`,
          }}
        />
      );
    }

    case 'rect':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s * 1.6,
            height: s * 0.65,
            background: color,
            borderRadius: '3px',
          }}
        />
      );

    case 'cylinder':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s * 0.5,
            height: s * 1.3,
            background: `linear-gradient(90deg, ${color}55, ${color}, ${color}55)`,
            borderRadius: `${s * 0.25}px`,
          }}
        />
      );

    case 'waterdrop':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            background: color,
            borderRadius: '0 50% 50% 50%',
            transform: 'rotate(-45deg)',
          }}
        />
      );

    case 'crescent':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            borderRadius: '50%',
            background: 'transparent',
            boxShadow: `inset ${-s * 0.22}px ${s * 0.06}px 0 0 ${color}`,
          }}
        />
      );

    case 'blob':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            background: color,
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          }}
        />
      );

    case 'irregular':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            background: color,
            clipPath: 'polygon(20% 0%, 78% 5%, 100% 28%, 97% 72%, 75% 100%, 32% 97%, 5% 78%, 0% 32%)',
          }}
        />
      );

    case 'octagon':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            background: color,
            clipPath: 'polygon(29% 0%, 71% 0%, 100% 29%, 100% 71%, 71% 100%, 29% 100%, 0% 71%, 0% 29%)',
          }}
        />
      );

    case 'triangle':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            background: color,
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
      );

    case 'square':
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            background: color,
            borderRadius: '6px',
          }}
        />
      );

    case 'sphere':
    default:
      return (
        <div
          className={animClass}
          style={{
            ...base,
            width: s,
            height: s,
            background: color,
            borderRadius: '50%',
          }}
        />
      );
  }
};

const FloatingShapes = ({ colorScheme = 'g2', mode = 'dark' }) => {
  const config = THEME_CONFIGS[colorScheme] || THEME_CONFIGS.g2;
  const isLight = mode === 'light';
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
        mixBlendMode: isLight ? 'multiply' : 'screen',
      }}
      aria-hidden="true"
    >
      {BASE_POSITIONS.map((pos, i) => (
        <ShapeEl
          key={i}
          pos={pos}
          type={config.seq[i]}
          color={config.palette[i % config.palette.length]}
          index={i}
        />
      ))}
    </div>
  );
};

export default FloatingShapes;
