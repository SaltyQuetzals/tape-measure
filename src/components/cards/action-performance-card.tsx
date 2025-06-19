'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ActionPerformanceCardProps {
  actionPerformances: Record<string, {
    success: number;
    failure: number;
}>;
}

export function ActionPerformanceCard({ actionPerformances }: ActionPerformanceCardProps) {
  // Transform data for pie chart
  const chartData = Object.entries(actionPerformances).map(([action, counts]) => ({
    name: action,
    success: counts.success,
    failure: counts.failure,
    total: counts.success + counts.failure
  }));

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Action Performance
        </h3>
        <p className="text-sm text-muted-foreground">
          Success vs failure rates by action type
        </p>
      </div>
      <div className="p-0 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 gap-y-2">
          {chartData.map((action) => (
            <div key={action.name} className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Success', value: action.success },
                      { name: 'Failure', value: action.failure }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    innerRadius={20}
                    outerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#00C49F" />
                    <Cell fill="#FF8042" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center">
                <span className="font-medium text-sm">{action.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
