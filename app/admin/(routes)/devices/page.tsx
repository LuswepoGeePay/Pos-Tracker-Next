"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
import { PosDevice } from '@/utils/types/PosDevices'
import { PosDeviceDataTable } from './devices-data-table'
import { PosDeviceColumns } from './devices-columns'
import ViewDeviceDialog from '@/components/custom/dialogs/devices/view-device-dialog'
import EditDeviceDialog from '@/components/custom/dialogs/devices/edit-device-dialog'

import dynamic from 'next/dynamic'

// Dynamically import DeviceMap with SSR disabled
const DeviceMap = dynamic(() => import('@/components/custom/common/DeviceMap'), {
  ssr: false,
})

import { Download, BatteryCharging, PowerOff, Smartphone, ChevronDown, ChevronUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { format } from 'date-fns'


const AllPosDevicesPage = () => {

  // Filter states
  const [filters, setFilters] = useState({
    business_id: '',
    status: '',
    phone_number: '',
    current_app_version: '',
    serial_number: '',
    location_last_updated_start: '',
    location_last_updated_end: '',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const [businesses, setBusinesses] = useState<any[]>([]);
  const [posDeviceData, setPosDeviceData] = useState<PosDevice[]>([]);
  const [viewPosDevice, setViewPosDevice] = useState<PosDevice | null>(null);
  const [editPosDevice, setEditPosDevice] = useState<PosDevice | null>(null);
  const [deletePosDevice, setDeletePosDevice] = useState<PosDevice | null>(null);
  const { data: session, status } = useSession();
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

    const queryParams = new URLSearchParams({
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
    });

    // Add filters to query params if they have values
    if (filters.business_id) queryParams.append('business_id', filters.business_id);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.phone_number) queryParams.append('phone_number', filters.phone_number);
    if (filters.current_app_version) queryParams.append('current_app_version', filters.current_app_version);
    if (filters.serial_number) queryParams.append('serial_number', filters.serial_number);
    if (filters.location_last_updated_start) queryParams.append('location_last_updated_start', filters.location_last_updated_start);
    if (filters.location_last_updated_end) queryParams.append('location_last_updated_end', filters.location_last_updated_end);

    const response = await fetch(`${api_endpoints.getPosDevices}?${queryParams}`, {
      headers: {
        "Authorization": `Bearer ${session?.accessToken}`
      }
    });

    const responseBody = await response.json();
    console.log('first', responseBody)
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
          primary_number: posDevice.primary_number,
          secondary_number: posDevice.secondary_number
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
      const res = await fetch(api_endpoints.getDashboardTileInfo, {
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`
        },
      })
      const data = await res.json()

      console.log('data', data)

      if (data.status === 'success') {
        setTileData({
          pos_devices: data.info.pos_devices ?? 0,
          active_devices: data.info.active_devices ?? 0,
          offline_devices: data.info.offline_devices ?? 0,
          apps: data.info.apps,
          app_version: data.info.app_version,
          new_locations: data.locations_tracked ?? 0, // hardcoded for now
        })
      } else if (data.status == "failure") {
        toast.error("Unable to fetch dashboard information.")
      }
    } catch (err) {
      console.error('Failed to fetch dashboard info:', err)
    }
  }

  const fetchBusinesses = async () => {
    try {
      const res = await fetch(`${api_endpoints.getBusinesses}?page=1&pageSize=1000`, {
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`
        }
      })
      const data = await res.json()

      if (data.status === 'success' && data.businesss?.business) {
        setBusinesses(data.businesss.business)
      }
    } catch (err) {
      console.error('Failed to fetch businesses:', err)
    }
  }


  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchPosDevices();
      fetchTileInfo();
      fetchBusinesses();
    }
  }, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // Reset pagination when filters change
    setPagination({ pageIndex: 0, pageSize: 20 });
  };

  const handleClearFilters = () => {
    setFilters({
      business_id: '',
      status: '',
      phone_number: '',
      current_app_version: '',
      serial_number: '',
      location_last_updated_start: '',
      location_last_updated_end: '',
    });
    setPagination({ pageIndex: 0, pageSize: 20 });
  };

  const exportToCSV = () => {
    if (posDeviceData.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Define CSV headers
    const headers = [
      'Serial Number',
      'Device Name',
      'Business',
      'Status',
      'Current App Version',
      'Phone Number 1',
      'Phone Number 2',
      'Device Model',
      'Operating System',
      'Latitude',
      'Longitude',
      'Last Location Updated'
    ];

    // Convert data to CSV format
    const csvData = posDeviceData.map((device: any) => [
      device.serial_number,
      device.name,
      device.business_name,
      device.status,
      device.current_app_version,
      device.phone_number1,
      device.phone_number2,
      device.device_model,
      device.operating_system,
      device.last_known_latitude,
      device.last_known_longitude,
      device.location_last_updated
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        row.map(cell => {
          // Escape quotes and wrap in quotes if contains comma
          const cellStr = String(cell || '');
          return cellStr.includes(',') ? `"${cellStr.replace(/"/g, '""')}"` : cellStr;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pos-devices-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Devices exported to CSV');
  };

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
          fetchPosDevices();
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

      {/* Filter Card */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="w-full mb-8">
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <CardTitle>Filter Devices</CardTitle>
                <div className="flex items-center gap-2">
                  <p className='text-xs text-gray-400 font-normal hidden sm:block'>
                    {isFilterOpen ? 'Click to hide filters' : 'Click to show filters'}
                  </p>
                  {isFilterOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                </div>
              </div>
              <p className='text-sm text-gray-600 mt-2'>Search by business, status, contact info, version, serial number, or location update date</p>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Separator />
            <CardContent className='p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {/* Business Filter */}
                <div className='space-y-2'>
                  <Label htmlFor='business-filter'>Business</Label>
                  <Select value={filters.business_id} onValueChange={(value) => handleFilterChange('business_id', value)}>
                    <SelectTrigger id='business-filter' className='w-full'>
                      <SelectValue placeholder='Select business' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Businesses</SelectItem>
                      {businesses && businesses?.map((business: any) => (
                        <SelectItem key={business.id} value={business.id}>
                          {business.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className='space-y-2'>
                  <Label htmlFor='status-filter'>Status</Label>
                  <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                    <SelectTrigger id='status-filter' className='w-full'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All Status</SelectItem>
                      <SelectItem value='online'>Online</SelectItem>
                      <SelectItem value='offline'>Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Number Filter */}
                <div className='space-y-2'>
                  <Label htmlFor='phone-filter'>Phone Number</Label>
                  <Input
                    id='phone-filter'
                    placeholder='Filter by phone number...'
                    value={filters.phone_number}
                    onChange={(e) => handleFilterChange('phone_number', e.target.value)}
                  />
                </div>

                {/* App Version Filter */}
                <div className='space-y-2'>
                  <Label htmlFor='app-version-filter'>App Version</Label>
                  <Input
                    id='app-version-filter'
                    placeholder='Filter by app version...'
                    value={filters.current_app_version}
                    onChange={(e) => handleFilterChange('current_app_version', e.target.value)}
                  />
                </div>

                {/* Serial Number Filter */}
                <div className='space-y-2'>
                  <Label htmlFor='serial-filter'>Serial Number</Label>
                  <Input
                    id='serial-filter'
                    placeholder='Filter by serial number...'
                    value={filters.serial_number}
                    onChange={(e) => handleFilterChange('serial_number', e.target.value)}
                  />
                </div>

                {/* Location Last Updated Start Date */}
                <div className='space-y-2'>
                  <Label htmlFor='location-start-filter'>Location Updated (Start)</Label>
                  <Input
                    id='location-start-filter'
                    type='date'
                    value={filters.location_last_updated_start}
                    onChange={(e) => handleFilterChange('location_last_updated_start', e.target.value)}
                  />
                </div>

                {/* Location Last Updated End Date */}
                <div className='space-y-2'>
                  <Label htmlFor='location-end-filter'>Location Updated (End)</Label>
                  <Input
                    id='location-end-filter'
                    type='date'
                    value={filters.location_last_updated_end}
                    onChange={(e) => handleFilterChange('location_last_updated_end', e.target.value)}
                  />
                </div>
              </div>

              <div className='flex gap-3 mt-6'>
                <Button
                  onClick={handleClearFilters}
                  variant='outline'
                  className='flex-1'
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={exportToCSV}
                  className='flex-1 bg-green-600 hover:bg-green-700 text-white'
                >
                  <Download className='w-4 h-4 mr-2' />
                  Export to CSV
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <Card className='border-5 border-l-blue-500 border-r-0 border-b-0 border-t-0'>
          <CardContent className='flex justify-between items-center'>

            <div>
              <p>All Devices</p>
              <p>{tileData.pos_devices}</p>
            </div>
            <Smartphone className='text-blue-500' />


          </CardContent>
        </Card>
        <Card className='border-5 border-l-green-500 border-r-0 border-b-0 border-t-0'>
          <CardContent className='flex justify-between items-center'>

            <div>
              <p>Active Devices</p>
              <p>{tileData.active_devices}</p>

            </div>

            <BatteryCharging className='text-green-500' />


          </CardContent>
        </Card>
        <Card className='border-5 border-l-red-500 border-r-0 border-b-0 border-t-0'>
          <CardContent className='flex justify-between items-center'>

            <div>
              <p>Inactive Devices</p>
              <p>{tileData.offline_devices}</p>
            </div>
            <PowerOff className='text-red-500' />


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


          <div className={viewPosDevice || editPosDevice ? 'hidden ' : ''}>
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