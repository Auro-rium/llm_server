
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricHistory } from '../types';

interface MetricsGraphProps {
  data: MetricHistory[];
}

export const MetricsGraph: React.FC<MetricsGraphProps> = ({ data }) => {
  return (
    <div className="h-full w-full py-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line 
            type="stepAfter" 
            dataKey="cpu" 
            stroke="#00c8e6" 
            strokeWidth={1} 
            dot={false} 
            isAnimationActive={false}
            opacity={0.6}
          />
          <XAxis hide dataKey="time" />
          <YAxis hide domain={[0, 100]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
