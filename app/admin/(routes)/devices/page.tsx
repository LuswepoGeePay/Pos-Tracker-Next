"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
import { PosDevice } from '@/utils/types/PosDevices'
import { PosDeviceDataTable } from './devices-data-table'
import { PosDeviceColumns } from './devices-columns'
import ViewDeviceDialog from '@/components/custom/dialogs/devices/view-device-dialog'
import EditDeviceDialog from '@/components/custom/dialogs/devices/edit-device-dialog'


const AllPosDevicesPage = () => {

  const [posDeviceData, setPosDeviceData] = useState<PosDevice[]>([])
  const [viewPosDevice, setViewPosDevice] = useState<PosDevice | null>(null);
  const [editPosDevice, setEditPosDevice] = useState<PosDevice | null>(null);
  const [deletePosDevice, setDeletePosDevice] = useState<PosDevice | null>(null);
const { data: session, status } = useSession();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const [totalPages, setTotalPages] = useState(0);


  const fetchPosDevices = async () => {
      console.log('first', session?.id)
    const body = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };

    const response = await fetch(api_endpoints.getPosDevices, {
      method: "POST",
      headers: {
        "Content-Type": "posDevicelication/json",
        "Authorization": `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(body)
    });

    console.log('first', session?.accessToken)

    const responseBody = await response.json();
    if (responseBody["status"] === "success") {
      if (responseBody?.devices?.posdevice) {
        const posDevices = responseBody.devices.posdevice.map((posDevice: PosDevice) => ({
          id: posDevice.id,
          serial_number:posDevice.serial_number,
          current_app_version:posDevice.current_app_version,
          last_long:posDevice.last_known_longitude,
          last_lat:posDevice.last_known_latitude,
          status:posDevice.status,
          device_model: posDevice.device_model,
          operating_system:posDevice.operating_system,
          loc_last:posDevice.location_last_updated,
          description:posDevice.description,
          name:posDevice.name,
          business_name:posDevice.business_name
         
        }))
        setPosDeviceData(posDevices);
        setTotalPages(responseBody.devices.totalPages || 0);

       
      } // Set the fetched data
    }
    else if (responseBody["status"] == "failure") {
      toast.error(`${responseBody.error}\n${responseBody.detail}`)
    }


    else {
      toast.error("Failed to fetch posDevice version data");
    }

  }

useEffect(() => {
  if (status === 'authenticated' && session?.accessToken) {
    fetchPosDevices();
  }
}, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize]);

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
    <main className='m-10'>


      <Card className='w-[340px] md:w-full my-20'>

        <CardContent className='p-8'>
          <div className='mb-10'>
            <p className='text-2xl font-bold'>Point Of Sale Devices</p>
            <p className='text-sm mb-1'>View, edit, delete, existing Point Of Sale Devices</p>
            <Separator />
          </div>
          
          <div className={viewPosDevice || editPosDevice ? 'hidden ' : ''}>
            <PosDeviceDataTable
              columns={PosDeviceColumns(setViewPosDevice, setEditPosDevice, setDeletePosDevice)}
              data={posDeviceData} />

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

        </CardContent>
      </Card>
    </main>
  )
}

export default AllPosDevicesPage