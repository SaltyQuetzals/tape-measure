"use client"

import * as React from "react"
import { CartesianGrid, XAxis, LineChart, YAxis, Legend, Line } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { CONVERSATION_STATUSES } from "@/lib/constants"
import { useState } from "react"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig



const PALETTE: Record<(typeof CONVERSATION_STATUSES)[number], string> = {
  active: "#1f77b4",              // blue
  booked: "#2ca02c",              // green
  declined: "#d62728",            // red
  blocked_needs_human: "#ff7f0e", // orange
  completed: "#9467bd",           // purple
  cancelled: "#bcbd22",           // olive
  abandoned: "#17becf",           // cyan
  wrong_number: "#e377c2",        // pink
  do_not_contact: "#8c564b",      // brown
  spam: "#7f7f7f",                // gray
}

export function ChartLineInteractive({ resolutionRateOverTime }: {
  resolutionRateOverTime: {
    date: string;
    active: number;
    booked: number;
    declined: number;
    blocked_needs_human: number;
    completed: number;
    cancelled: number;
    abandoned: number;
    wrong_number: number;
    do_not_contact: number;
    spam: number;
  }[]
}) {
  const [activeSeries, setActiveSeries] = useState<string[]>([...CONVERSATION_STATUSES]);
  const handleLegendClick = (dataKey?: string) => {
    if (!dataKey) return;
    if (activeSeries.includes(dataKey)) {
      setActiveSeries(activeSeries.filter(el => el !== dataKey));
    } else {
      setActiveSeries(prev => [...prev, dataKey]);
    }
  };
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Daily conversation outcome</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart width={730} height={250} data={resolutionRateOverTime}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }} />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Legend onClick={(props) => handleLegendClick(props.dataKey as string)} />
            {CONVERSATION_STATUSES.map((status) => (
              <Line hide={!activeSeries.includes(status)} key={status} type="monotone" dataKey={status} stroke={PALETTE[status as keyof typeof PALETTE]} />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}