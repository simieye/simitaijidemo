// @ts-ignore;
import React from 'react';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
export function TaijiChart({
  yinData,
  yangData,
  balanceScore
}) {
  const data = [{
    name: '阴',
    value: yinData.percentage || 50,
    color: '#000000'
  }, {
    name: '阳',
    value: yangData.percentage || 50,
    color: '#ffffff'
  }];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill={percent > 0.5 ? "white" : "black"} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-semibold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>;
  };
  return <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">太极平衡分析</h3>
        <div className="text-sm text-gray-600">
          平衡分数: <span className="font-bold text-lg">{balanceScore || 85}</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={100} fill="#8884d8" dataKey="value" startAngle={90} endAngle={-270}>
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="#666" strokeWidth={2} />)}
          </Pie>
          <Tooltip contentStyle={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          border: 'none',
          borderRadius: '8px',
          color: 'white'
        }} />
          <Legend verticalAlign="bottom" height={36} formatter={value => <span className="text-gray-700">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-black bg-opacity-10 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-1">阴元素</h4>
          <p className="text-sm text-gray-600">{yinData.description || '内敛、稳定、深沉'}</p>
        </div>
        <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-gray-300">
          <h4 className="font-semibold text-gray-800 mb-1">阳元素</h4>
          <p className="text-sm text-gray-600">{yangData.description || '外放、活跃、明亮'}</p>
        </div>
      </div>
    </div>;
}