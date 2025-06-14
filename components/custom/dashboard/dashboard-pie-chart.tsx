"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { status: "offline", devices: 275 },
  { status: "online", devices: 187 },
]

const COLORS = {
  offline: "var(--chart-1)",
  online: "var(--chart-2)",
}

const DashboardPieChart = () => {
  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Devices by Status</CardTitle>
        <CardDescription>Overview of operational POS devices</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            devices: { label: "Devices" },
            offline: { label: "Offline", color: COLORS.offline },
            online: { label: "Online", color: COLORS.online },
          }}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="devices"
              nameKey="status"
              outerRadius={80}
              innerRadius={50}
              paddingAngle={4}
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.status}`}
                  fill={COLORS[entry.status as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/2 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default DashboardPieChart
