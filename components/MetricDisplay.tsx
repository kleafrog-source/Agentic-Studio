import React from 'react';
import { MMSSMetric } from '../types';

interface MetricDisplayProps {
  metrics: MMSSMetric[];
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-mmss-panel border border-mmss-border p-3 rounded-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-1 opacity-20 text-4xl font-bold select-none group-hover:opacity-40 transition-opacity text-mmss-purple">
            {metric.id}
          </div>
          <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">{metric.name}</div>
          <div className="text-2xl font-bold text-mmss-accent mt-1 font-mono">
            {metric.value.toFixed(4)}
          </div>
          <div className="text-[10px] text-gray-500 font-mono mt-1 truncate" title={metric.formula}>
            {metric.formula}
          </div>
          <div className="w-full bg-gray-700 h-1 mt-2 rounded-full overflow-hidden">
             <div 
               className="bg-mmss-accent h-full transition-all duration-500" 
               style={{ width: `${Math.min((metric.value / (metric.target * 1.1)) * 100, 100)}%` }}
             />
          </div>
        </div>
      ))}
    </div>
  );
};