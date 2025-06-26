"use client"
// import CreateAppForm from '@/components/custom/forms/locations/create-location-form'
// import { App, LHistory } from '@/utils/types/Apps'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
// import ViewAppDialog from '@/components/custom/dialogs/locations/view-location-dialog'
// import EditAppDialog from '@/components/custom/dialogs/locations/edit-location-dialog'
// import EditLHistoryDialog from '@/components/custom/dialogs/locationvs/edit-version-dialog'
// import ViewLHistoryDialog from '@/components/custom/dialogs/locationvs/view-version-dialog'
import { format } from 'date-fns'
import { LHistory } from '@/utils/types/PosDevices'
import { LocationDataTable } from './locations-data-table'
import { LocationColumns } from './locations-columns'
import ViewLHistoryDialog from '@/components/custom/dialogs/locations/view-device-dialog'


const AllPosDevicesPage = () => {

  const [locationData, setLocationData] = useState<LHistory[]>([])
  const [viewLocation, setViewLocation] = useState<LHistory | null>(null);
  const [editLocation, setEditLocation] = useState<LHistory | null>(null);
  const [deleteLocation, setDeleteLocation] = useState<LHistory | null>(null);
  const { data: session, status } = useSession();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [totalPages, setTotalPages] = useState(0);


  const fetchLocations = async () => {
    const body = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };

    const response = await fetch(api_endpoints.getLocations, {
      method: "POST",
      headers: {
        "Content-Type": "locationlication/json",
        "Authorization": `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(body)
    });

    const responseBody = await response.json();
    if (responseBody["status"] === "success") {
      if (responseBody?.history?.location_history) {
        const locations = responseBody.history.location_history.map((location: LHistory) => ({
          id: location.id,
          posdevice_id: location.posdevice_id,
          longitude: location.longitude,
          latitude: location.latitude,
          accuracy: location.accuracy,
          timestamp: format(location.timestamp, "MMMM dd yyyy, HH:mm"),
          name:location.device_name,
          region:location.region
        }))
        setLocationData(locations);
        setTotalPages(responseBody.history.totalPages || 0);

   console.log('locationData', locationData)

      } // Set the fetched data
    }
    else if (responseBody["status"] == "failure") {
      toast.error(`${responseBody.error}\n${responseBody.detail}`)
    }


    else {
      toast.error("Failed to fetch location version data");
    }

  }

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchLocations();
    }
  }, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize]);

  const handleDeleteLocation = async () => {
    if (deleteLocation) {
      try {
        const response = await fetch(`${api_endpoints.deleteLocation}/${deleteLocation.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session?.accessToken}`
          }
        });

        const responseBody = await response.json();

        if (responseBody["status"] === "success") {
          toast.success(responseBody["message"]);
          window.location.reload()
          fetchLocations(); // Refresh the data instead of reloading the page
        } else {
          toast.error(responseBody["error"]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (error) {
        toast.error(`Something went wrong, please try again`);
      } finally {
        setDeleteLocation(null);
      }
    }
  };


  return (
    <main className='m-10'>


      <Card className='w-[340px] md:w-full my-20'>

        <CardContent className='p-8'>
          <div className='mb-10'>
            <p className='text-2xl font-bold'>Locations</p>
            <p className='text-sm mb-1'>View, edit, delete, existing location history entries</p>
            <Separator />
          </div>

          <div className={viewLocation || editLocation ? 'hidden ' : ''}>
            <LocationDataTable
              columns={LocationColumns(setViewLocation, setEditLocation, setDeleteLocation)}
              data={locationData} />

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

          <ViewLHistoryDialog
            history={viewLocation}
            open={!!viewLocation}
            onClose={() => setViewLocation(null)}
          />
    
          <Dialog open={!!deleteLocation} onOpenChange={(open) => !open && setDeleteLocation(null)}>
            <DialogContent className='w-[350px] md:w-[800px] rounded-lg'>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this Location? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteLocation(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteLocation}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </main>
  )
}

export default AllPosDevicesPage