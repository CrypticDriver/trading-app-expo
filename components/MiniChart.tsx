import React from 'react';
import Svg, { Polyline, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MiniChartProps {
  isUp: boolean;
  seed: number;
  width?: number;
  height?: number;
}

export default function MiniChart({ isUp, seed, width = 56, height = 16 }: MiniChartProps) {
  const points: string[] = [];
  let val = 100;
  for (let i = 0; i < 24; i++) {
    val += ((((seed + i) * 9301 + 49297) % 233280) / 233280 - 0.5) * 4;
    const x = (i / 23) * width;
    const y = height - ((val - 96) / 8) * (height - 4) + 2;
    const clampedY = Math.max(2, Math.min(height - 2, y));
    points.push(`${x.toFixed(1)},${clampedY.toFixed(1)}`);
  }

  const color = isUp ? '#e74c3c' : '#27ae60';
  const gradId = `grad-${seed}`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <Stop offset="100%" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path
        d={`M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`}
        fill={`url(#${gradId})`}
      />
      <Polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
