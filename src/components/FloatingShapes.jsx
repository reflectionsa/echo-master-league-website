/**
 * FloatingShapes — ambient animated geometric shapes that drift behind content.
 * Fixed positions/sizes for SSR-safe determinism; colors pick from the theme accent palette.
 */

const SHAPE_DEFS = [
  { id: 0,  type: 'circle',  color: '#ff6b2b', size: 90,  left: 5,   top: 12,  dur: 20, delay: 0,   opacity: 0.22, anim: 'a' },
  { id: 1,  type: 'diamond', color: '#00bfff', size: 44,  left: 88,  top: 18,  dur: 14, delay: -3,  opacity: 0.20, anim: 'b' },
  { id: 2,  type: 'hex',     color: '#7c3aed', size: 65,  left: 48,  top: 4,   dur: 22, delay: -7,  opacity: 0.18, anim: 'drift' },
  { id: 3,  type: 'tri',     color: '#00e5ff', size: 38,  left: 73,  top: 68,  dur: 16, delay: -5,  opacity: 0.20, anim: 'a' },
  { id: 4,  type: 'ring',    color: '#ef4444', size: 100, left: 18,  top: 78,  dur: 24, delay: -2,  opacity: 0.18, anim: 'b' },
  { id: 5,  type: 'circle',  color: '#10b981', size: 55,  left: 62,  top: 42,  dur: 17, delay: -9,  opacity: 0.20, anim: 'drift' },
  { id: 6,  type: 'diamond', color: '#ff6b2b', size: 32,  left: 33,  top: 58,  dur: 12, delay: -4,  opacity: 0.22, anim: 'a' },
  { id: 7,  type: 'hex',     color: '#00bfff', size: 50,  left: 8,   top: 48,  dur: 19, delay: -6,  opacity: 0.18, anim: 'b' },
  { id: 8,  type: 'tri',     color: '#a855f7', size: 58,  left: 80,  top: 43,  dur: 18, delay: -1,  opacity: 0.20, anim: 'drift' },
  { id: 9,  type: 'ring',    color: '#ff8c42', size: 75,  left: 14,  top: 28,  dur: 21, delay: -8,  opacity: 0.16, anim: 'a' },
  { id: 10, type: 'circle',  color: '#00e5ff', size: 28,  left: 44,  top: 84,  dur: 13, delay: -3,  opacity: 0.22, anim: 'b' },
  { id: 11, type: 'diamond', color: '#10b981', size: 68,  left: 68,  top: 10,  dur: 26, delay: -11, opacity: 0.18, anim: 'drift' },
  { id: 12, type: 'circle',  color: '#7c3aed', size: 42,  left: 25,  top: 92,  dur: 15, delay: -5,  opacity: 0.20, anim: 'a' },
  { id: 13, type: 'hex',     color: '#ff6b2b', size: 30,  left: 55,  top: 72,  dur: 23, delay: -7,  opacity: 0.18, anim: 'b' },
];

const clipPaths = {
  hex: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
  tri: 'polygon(50% 0%, 100% 100%, 0% 100%)',
};

const ShapeEl = ({ def }) => {
  const animClass =
    def.anim === 'a' ? 'eml-shape eml-shape-float-a' :
    def.anim === 'b' ? 'eml-shape eml-shape-float-b' :
                       'eml-shape eml-shape-drift';

  const baseStyle = {
    left: `${def.left}%`,
    top: `${def.top}%`,
    width: `${def.size}px`,
    height: `${def.size}px`,
    opacity: def.opacity,
    '--dur': `${def.dur}s`,
    '--delay': `${def.delay}s`,
  };

  if (def.type === 'ring') {
    return (
      <div
        className={animClass}
        style={{
          ...baseStyle,
          borderRadius: '50%',
          border: `3px solid ${def.color}`,
          background: 'transparent',
        }}
      />
    );
  }
  if (def.type === 'diamond') {
    return (
      <div
        className={animClass}
        style={{
          ...baseStyle,
          background: def.color,
          transform: 'rotate(45deg)',
          borderRadius: '4px',
        }}
      />
    );
  }
  if (def.type === 'hex' || def.type === 'tri') {
    return (
      <div
        className={animClass}
        style={{
          ...baseStyle,
          background: def.color,
          clipPath: clipPaths[def.type],
        }}
      />
    );
  }
  // circle
  return (
    <div
      className={animClass}
      style={{
        ...baseStyle,
        borderRadius: '50%',
        background: def.color,
      }}
    />
  );
};

const FloatingShapes = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 2,
      mixBlendMode: 'screen',
    }}
    aria-hidden="true"
  >
    {SHAPE_DEFS.map(def => <ShapeEl key={def.id} def={def} />)}
  </div>
);

export default FloatingShapes;
