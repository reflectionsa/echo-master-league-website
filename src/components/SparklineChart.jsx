/**
 * SparklineChart - A small inline SVG line graph for showing trend data
 * HLTV-style player performance trend visualization
 */

const SparklineChart = ({ data = [], width = 80, height = 28, color = '#ff6b2b', positiveColor = '#22c55e', negativeColor = '#ef4444', showDot = true }) => {
  if (!data || data.length < 2) {
    // Flat line placeholder
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="3,2" />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pad = 3;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const points = data.map((val, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + h - ((val - min) / range) * h;
    return [x, y];
  });

  const pathD = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  // Determine trend color
  const trend = data[data.length - 1] - data[0];
  const lineColor = trend > 0 ? positiveColor : trend < 0 ? negativeColor : color;

  // Area fill under line
  const areaD = `${pathD} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`;

  const [lastX, lastY] = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} overflow="visible">
      <defs>
        <linearGradient id={`spark-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path
        d={areaD}
        fill={`url(#spark-grad-${color.replace('#', '')})`}
      />
      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {showDot && (
        <circle cx={lastX} cy={lastY} r="2.5" fill={lineColor} />
      )}
    </svg>
  );
};

/**
 * Generate deterministic pseudo-trend data from a player name + base value
 * Used when no real historical data is available
 */
export const generateTrendData = (playerName, baseValue, points = 8) => {
  if (!playerName) return Array(points).fill(baseValue);
  // Simple deterministic hash from name
  let seed = 0;
  for (let i = 0; i < playerName.length; i++) {
    seed = (seed * 31 + playerName.charCodeAt(i)) % 10000;
  }
  const arr = [];
  let val = baseValue * 0.85;
  for (let i = 0; i < points; i++) {
    seed = (seed * 1664525 + 1013904223) % 2147483648;
    const delta = ((seed % 200) - 80) / 100;
    val = Math.max(baseValue * 0.6, Math.min(baseValue * 1.3, val + delta * baseValue * 0.08));
    arr.push(Math.round(val));
  }
  // Bias the last value toward realistic end
  arr[points - 1] = Math.round(baseValue * (0.9 + ((seed % 200) / 1000)));
  return arr;
};

export default SparklineChart;
