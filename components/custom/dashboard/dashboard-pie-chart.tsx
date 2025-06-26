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
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { api_endpoints } from "@/utils/api_constants"
import toast from "react-hot-toast"

const DashboardPieChart = () => {

       const { data: session, status } = useSession();
    
        const [tileData, setTileData] = useState({
        pos_devices: 0,
        active_devices: 0,
        offline_devices: 0,
        apps: 0,
        app_version: 'N/A',
        new_locations: 0, // assuming you add this later
      })
  const fetchTileInfo = async () => {

      try {
        const res = await fetch(api_endpoints.getDashboardTileInfo,  {
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`
        },}) 
        const data = await res.json()
  
        console.log('data', data)
  
        if (data.status === 'success') {
          setTileData({
            pos_devices: data.info.pos_devices ?? 0,
            active_devices: data.info.active_devices ?? 0,
            offline_devices: data.info.offline_devices  ?? 0,
            apps: data.info.apps,
            app_version: data.info.app_version,
            new_locations: data.locations_tracked ?? 0, // hardcoded for now
          })
        } else if(data.status == "failure"){
          toast.error("Unable to fetch dashboard information.")
        }
      } catch (err) {
        console.error('Failed to fetch dashboard info:', err)
      }
    }

     useEffect(() => {
        if (status === 'authenticated' && session?.accessToken) {
          fetchTileInfo()
        }
      }, [status, session?.accessToken]);

  
const chartData = [
  { status: "offline", devices: tileData.offline_devices },
  { status: "online", devices: tileData.active_devices },
]

const COLORS = {
  offline: "var(--chart-1)",
  online: "var(--chart-2)",
}

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
