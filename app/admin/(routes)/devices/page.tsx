"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
import { LHistory, PosDevice } from '@/utils/types/PosDevices'
import { PosDeviceDataTable } from './devices-data-table'
import { PosDeviceColumns } from './devices-columns'
import ViewDeviceDialog from '@/components/custom/dialogs/devices/view-device-dialog'
import EditDeviceDialog from '@/components/custom/dialogs/devices/edit-device-dialog'

import dynamic from 'next/dynamic'

// Dynamically import DeviceMap with SSR disabled
const DeviceMap = dynamic(() => import('@/components/custom/common/DeviceMap'), {
  ssr: false,
})

// import z from 'zod'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from '@/components/ui/input'
// import { Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { BatteryCharging, Loader2, PowerOff, Smartphone } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
// const FilterSchema = z.object({
//   start_date: z.string().optional(),
//   end_date: z.string().optional(),
//   appversion: z.string().optional(),
// })


const AllPosDevicesPage = () => {

  // const form = useForm<z.infer<typeof FilterSchema>>({
  //   resolver: zodResolver(FilterSchema),
  //   defaultValues: {
  //     start_date: '',
  //     end_date: '',
  //     appversion: ""

  //   }
  // })

  const [posDeviceData, setPosDeviceData] = useState<PosDevice[]>([])
  const [viewPosDevice, setViewPosDevice] = useState<PosDevice | null>(null);
  const [editPosDevice, setEditPosDevice] = useState<PosDevice | null>(null);
  const [deletePosDevice, setDeletePosDevice] = useState<PosDevice | null>(null);
  const {data: session, status } = useSession();
  const [count, setCount] = useState<number | null>(0);
  const [selectedLocation, setSelectedLocation] = useState<PosDevice | null>(null);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
    const [tileData, setTileData] = useState({
    pos_devices: 0,
    active_devices: 0,
    offline_devices: 0,
    apps: 0,
    app_version: 'N/A',
    new_locations: 0, // assuming you add this later
  })



  // const [startDate, setStartDate] = useState<string | null>(null);

  // const [endDate, setEndDate] = useState<string | null>(null);

  // const [appVersion, setAppVersion] = useState<string | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [totalPages, setTotalPages] = useState(0);


  const fetchPosDevices = async () => {

    setLoading(true)

    const body = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      // start_date: startDate,
      // end_date: endDate
    };

    const response = await fetch(api_endpoints.getPosDevices, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(body)
    });

    const responseBody = await response.json();
    if (responseBody["status"] === "success") {
      setLoading(false)
      if (responseBody?.devices?.posdevice) {
        const posDevices = responseBody.devices.posdevice.map((posDevice: PosDevice) => ({
          id: posDevice.id,
          serial_number: posDevice.serial_number,
          current_app_version: posDevice.current_app_version,
          last_known_longitude: posDevice.last_known_longitude,
          last_known_latitude: posDevice.last_known_latitude,
          status: posDevice.status,
          device_model: posDevice.device_model,
          operating_system: posDevice.operating_system,
          loc_last: format(posDevice.location_last_updated, "MMMM dd yyyy, HH:mm"),
          description: posDevice.description,
          name: posDevice.name,
          business_name: posDevice.business_name,
          fingerprint: posDevice.fingerprint,
          phone_number1: posDevice.phone_number1,
          phone_number2: posDevice.phone_number2
        }))
        setPosDeviceData(posDevices);
        setTotalPages(responseBody.devices.totalPages || 0);
        setCount(responseBody.devices.count || 0)


      } 
    }
    else if (responseBody["status"] == "failure") {
      setLoading(false)
      setError(`${responseBody.error}\n${responseBody.detail}`);
      toast.error(`${responseBody.error}\n${responseBody.detail}`)
    }
    else {
      setLoading(false)
      toast.error("Failed to fetch devices data");
       setError("Failed to fetch devices data");
    }

  }

  
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
      fetchPosDevices();
      fetchTileInfo();
    }
  }, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize, ]);

  const handleDeletePosDevice = async () => {
    if (deletePosDevice) {
      try {
        const response = await fetch(`${api_endpoints.deletePosDevice}/${deletePosDevice.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session?.accessToken}`
          }
        });

        const responseBody = await response.json();

        if (responseBody["status"] === "success") {
          toast.success(responseBody["message"]);
          window.location.reload()
          fetchPosDevices(); // Refresh the data instead of reloading the page
        } else {
          toast.error(responseBody["error"]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (error) {
        toast.error(`Something went wrong, please try again`);
      } finally {
        setDeletePosDevice(null);
      }
    }
  };




  return (
    <main className='m-10 '>

      {/* <Card>
        <CardContent>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold ">Filter</h1>
            <p className="text-gray-700">Filter by status, date, app version</p>
          </div>

          <Form {...form}>
            <form
              // onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >


              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        placeholder="Enter your start date"
                        {...field}
                        className="  placeholder-gray-400 focus:border-amber-500"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">End Date</FormLabel>
                    <FormControl>
                      <div className='flex'>
                        <Input
                          type='date'
                          placeholder="Enter your end date"
                          {...field}
                          className="  placeholder-gray-400 focus:border-amber-500"
                        />
                      </div>

                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appversion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">App Version</FormLabel>
                    <FormControl>
                      <div className='flex'>
                        <Input
                          placeholder="Enter your end date"
                          {...field}
                          className="  placeholder-gray-400 focus:border-amber-500"
                        />
                      </div>

                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[#00aeff] hover:bg-[#3c3c8c] text-white md:row-start-3 m"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Filtering</>
                ) : (
                  "Apply Filters"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full md:row-start-3"
                onClick={() => {
                  form.reset();
                  setStartDate(null);
                  setEndDate(null);
                  setAppVersion(null);
                  setPagination({ pageIndex: 0, pageSize: 20 });
                }}
              >
                Clear Filters
              </Button>



            </form>
          </Form>
        </CardContent>
      </Card> */}

<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
  <Card className='border-5 border-l-blue-500 border-r-0 border-b-0 border-t-0'>
    <CardContent className='flex justify-between items-center'>
      
     <div>
       <p>All Devices</p>
      <p>{ tileData.pos_devices}</p>
     </div>
     <Smartphone className='text-blue-500'/>


    </CardContent>
  </Card>
   <Card className='border-5 border-l-green-500 border-r-0 border-b-0 border-t-0'>
    <CardContent className='flex justify-between items-center'>
      
      <div>
          <p>Active Devices</p>
      <p>{tileData.active_devices}</p>

      </div>
    
    <BatteryCharging className='text-green-500'/>


    </CardContent>
  </Card>
    <Card className='border-5 border-l-red-500 border-r-0 border-b-0 border-t-0'>
    <CardContent className='flex justify-between items-center'>
      
    <div>
        <p>Inactive Devices</p>
      <p>{tileData.offline_devices}</p>
    </div>
    <PowerOff  className='text-red-500'/>


    </CardContent>
  </Card>
</div>

      <Card className='w-[340px] md:w-full my-20'>

        <CardContent className='p-8 w-full'>
          <div className='mb-10'>
            <p className='text-2xl font-bold'>Point Of Sale Devices</p>
            <p className='text-sm mb-1'>View, edit, delete, existing Point Of Sale Devices</p>
            <Separator />
          </div>
          <div className='flex justify-between'>
            <div>
            </div>
            <div className='flex gap-3'>
              <p className='text-sm font-semibold'>Total Devices:</p>
              <p className='text-sm font-semibold'>{count}</p>
            </div>
          </div>

         
          <div  className={viewPosDevice || editPosDevice ? 'hidden ' : ''}>
  {loading ? (
    <Skeleton className="w-full h-[200px]" />
  ) : error ? (
    <p className="text-red-500 text-center">{error}</p>
  ) : (
   <PosDeviceDataTable
                columns={PosDeviceColumns(setViewPosDevice, setEditPosDevice, setDeletePosDevice, setSelectedLocation)}
                data={posDeviceData}
              />
  )}
</div>


          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(prev.pageIndex - 1, 0),
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              Previous
            </Button>
            <span>
              Page {pagination.pageIndex + 1} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={pagination.pageIndex + 1 >= totalPages}
            >
              Next
            </Button>
          </div>

          <ViewDeviceDialog
            pos={viewPosDevice}
            open={!!viewPosDevice}
            onClose={() => setViewPosDevice(null)}
          />
          <EditDeviceDialog
            pos={editPosDevice}
            open={!!editPosDevice}
            onClose={() => setEditPosDevice(null)}
          />

          <Dialog open={!!deletePosDevice} onOpenChange={(open) => !open && setDeletePosDevice(null)}>
            <DialogContent className='w-[350px] md:w-[800px] rounded-lg'>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this PosDevice? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeletePosDevice(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeletePosDevice}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedLocation} onOpenChange={() => setSelectedLocation(null)}>
            <DialogContent className="w-[800px] h-[600px]">
              <DialogHeader>
                <DialogTitle>Device Location</DialogTitle>
              </DialogHeader>
              {selectedLocation && (
                <DeviceMap
                  latitude={parseFloat(selectedLocation.last_known_latitude)}
                  longitude={parseFloat(selectedLocation.last_known_longitude)}
                  name={"selectedLocation.name"}
                />
              )}
            </DialogContent>
          </Dialog>
          

        </CardContent>
      </Card>
    </main>
  )
}

export default AllPosDevicesPage