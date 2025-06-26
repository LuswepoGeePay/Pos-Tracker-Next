"use client"
import { Card, CardContent } from '@/components/ui/card'
import { api_endpoints } from '@/utils/api_constants'
import { CodeXml, LayoutPanelLeft, MapPinCheck, PowerOff, Smartphone, SmartphoneCharging } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'



const DasboardTiles = () => {
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


const dynamicCardMetaData = [
    {
      id: '1',
      metric: 'Total POS Devices',
      value: tileData.pos_devices,
      icon: Smartphone,
      color: 'bg-blue-500',
    },
    {
      id: '2',
      metric: 'Active Devices (Today)',
      value: tileData.active_devices,
      icon: SmartphoneCharging,
      color: 'bg-green-500',
    },
    {
      id: '3',
      metric: 'Offline Devices',
      value: tileData.offline_devices,
      icon: PowerOff,
      color: 'bg-red-500',
    },
    {
      id: '4',
      metric: 'Registered Apps',
      value: tileData.apps,
      icon: CodeXml,
      color: 'bg-cyan-500',
    },
    {
      id: '5',
      metric: 'Latest App Version',
      value: tileData.app_version,
      icon: LayoutPanelLeft,
      color: 'bg-blue-500',
    },
    {
      id: '6',
      metric: 'New Locations Tracked (Today)',
      value: tileData.new_locations,
      icon: MapPinCheck,
      color: 'bg-lime-500',
    },
  ]
    return (
        <section className='w-full'>
            <div className='grid sm:grid-cols-1  md:grid-cols-2 lg:grid lg:grid-cols-3 gap-8'>
                {dynamicCardMetaData.map((card, index) =>
                    <Card key={index} className=''>
                        <CardContent className='flex gap-5 items-center '>

                            <div className={`${card.color} p-2 rounded-3xl text-white`}>
                                <card.icon />
                            </div>


                            <div className='flex  flex-col  items-end gap-5 w-full'>
                                <p className='text-lg font-semibold text-end'>{card.metric}</p>
                                <p className='text-xl font-bold'>{card.value}</p>
                            </div>



                        </CardContent>
                    </Card>)}
            </div>
        </section>
    )
}

export default DasboardTiles