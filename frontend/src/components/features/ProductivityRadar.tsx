import React from 'react';
import { cn } from '@/lib/utils';

interface RadarData {
  focus: number;
  execution: number;
  planning: number;
  teamwork: number;
  expertise: number;
  streak: number;
}

interface ProductivityRadarProps {
  data: RadarData;
  size?: number;
  className?: string;
}

export const ProductivityRadar: React.FC<ProductivityRadarProps> = ({
  data,
  size = 280,
  className,
}) => {
  const center = size / 2;
  const radius = size * 0.4;
  
  // Calculate points for hexagon (6 dimensions)
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2; // Start from top
    const distance = (value / 100) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y };
  };

  // Map data to array in order: Focus, Execution, Planning, Teamwork, Expertise, Streak
  const values = [
    data.focus * 5, // Scale 0-20 to 0-100
    data.execution * 5,
    data.planning * 5,
    data.teamwork * 5,
    data.expertise * 5,
    data.streak * 5,
  ];

  const labels = ['Focus', 'Exec', 'Plan', 'Team', 'Exp', 'Streak'];
  const labelPositions = [
    { x: center, y: 30 }, // Top
    { x: size - 20, y: center - 10 }, // Right top
    { x: size - 20, y: center + 10 }, // Right bottom
    { x: center, y: size - 20 }, // Bottom
    { x: 20, y: center + 10 }, // Left bottom
    { x: 20, y: center - 10 }, // Left top
  ];

  // Generate polygon points
  const points = values.map((value, index) => {
    const point = getPoint(index, value);
    return `${point.x},${point.y}`;
  }).join(' ');

  // Generate grid polygons
  const gridLevels = [0.33, 0.66, 1.0];
  const gridPolygons = gridLevels.map(level => {
    const gridPoints = Array.from({ length: 6 }, (_, i) => {
      const point = getPoint(i, radius * level);
      return `${point.x},${point.y}`;
    }).join(' ');
    return gridPoints;
  });

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full drop-shadow-xl">
        {/* Grid Background */}
        <polygon
          points={gridPolygons[2]}
          fill="#f8fafc"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <polygon
          points={gridPolygons[1]}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
        <polygon
          points={gridPolygons[0]}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Axis Lines */}
        {Array.from({ length: 6 }, (_, i) => {
          const point = getPoint(i, radius);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={points}
          fill="rgba(37, 99, 235, 0.2)"
          stroke="#2563EB"
          strokeWidth="2"
          className="animate-pulse"
        />

        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={labelPositions[i].x}
            y={labelPositions[i].y}
            textAnchor={i === 0 || i === 3 ? 'middle' : i < 3 ? 'start' : 'end'}
            className="text-[10px] font-bold fill-slate-500 uppercase"
          >
            {label}
          </text>
        ))}

        {/* Data Points */}
        {values.map((value, i) => {
          const point = getPoint(i, value);
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#2563EB"
              className="cursor-pointer hover:r-6 transition-all"
            >
              <title>
                {labels[i]} Lvl {Math.round(value / 5)} ({Math.round(value)}/100)
              </title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
};

