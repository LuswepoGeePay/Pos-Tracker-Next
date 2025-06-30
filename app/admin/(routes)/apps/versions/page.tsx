"use client"
import {  AppVersion } from '@/utils/types/Apps'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { api_endpoints } from '@/utils/api_constants'
import { VersionDataTable } from './versions-data-table'
import { VersionColumns } from './versions-columns'
import EditAppVersionDialog from '@/components/custom/dialogs/appvs/edit-version-dialog'
import ViewAppVersionDialog from '@/components/custom/dialogs/appvs/view-version-dialog'
import { format } from 'date-fns'


const AppVersionsPage = () => {

  const [appData, setAppData] = useState<AppVersion[]>([])
  const [viewApp, setViewApp] = useState<AppVersion | null>(null);
  const [editApp, setEditApp] = useState<AppVersion | null>(null);
  const [deleteApp, setDeleteApp] = useState<AppVersion | null>(null);
  const { data: session, status } = useSession();
    const [count, setCount] = useState<number | null>(0);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [totalPages, setTotalPages] = useState(0);


  const fetchApps = async () => {
    const body = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };

    const response = await fetch(api_endpoints.getAppVersions, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify(body)
    });


    const responseBody = await response.json();
    if (responseBody["status"] === "success") {
      if (responseBody?.apps?.app_version) {
        const apps = responseBody.apps.app_version.map((app: AppVersion) => ({
          version_id: app.version_id,
          version_number: app.version_number,
          build_number: app.build_number,
          release_notes: app.release_notes,
          file_size_bytes: app.file_size_bytes,
          checksum: app.checksum,
          is_latest_stable: app.is_latest_stable ?? false,
          released_at: format(app.released_at, "MMMM dd yyyy"),
          file_path: app.file_path,
          name: app.app_name,
          is_active:app.is_active ?? false,
          app_name:app.app_name,
        }))
        setAppData(apps);
        setTotalPages(responseBody.apps.totalPages || 0);
                setCount(responseBody.apps.count || 0);


      } // Set the fetched data
    }
    else if (responseBody["status"] == "failure") {
      toast.error(`${responseBody.error}\n${responseBody.detail}`)
    }


    else {
      toast.error("Failed to fetch app version data");
    }

  }

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchApps();
    }
  }, [status, session?.accessToken, pagination.pageIndex, pagination.pageSize]);

  const handleDeleteApp = async () => {
    if (deleteApp) {
      try {
        const response = await fetch(`${api_endpoints.deleteApp}/${deleteApp.version_id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${session?.accessToken}`
          }
        });

        const responseBody = await response.json();

        if (responseBody["status"] === "success") {
          toast.success(responseBody["message"]);
          window.location.reload()
          fetchApps(); // Refresh the data instead of reloading the page
        } else {
          toast.error(responseBody["error"]);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (error) {
        toast.error(`Something went wrong, please try again`);
      } finally {
        setDeleteApp(null);
      }
    }
  };


  return (
    <main className='m-10'>


      <Card className='w-[340px] md:w-full my-20'>

      

        <CardContent className='p-8'>
          <div className='mb-10'>
            <p className='text-2xl font-bold'>App Versions</p>
            <p className='text-sm mb-1'>View, edit, delete, existing Application Versions</p>
            <Separator />
          </div>
           <div className='flex justify-between'>
            <div>

            </div>
            <div className='flex gap-3'>
              <p className='text-sm font-semibold'>Total App Versions:</p>
              <p className='text-sm font-semibold'>{count}</p>
            </div>
          </div>


          <div className={viewApp || editApp ? 'hidden ' : ''}>
            <VersionDataTable
              columns={VersionColumns(setViewApp, setEditApp, setDeleteApp)}
              data={appData} />

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

          <ViewAppVersionDialog
            app={viewApp}
            open={!!viewApp}
            onClose={() => setViewApp(null)}
          />
          <EditAppVersionDialog
            appVersion={editApp}
            open={!!editApp}
            onClose={() => setEditApp(null)}
          />

          <Dialog open={!!deleteApp} onOpenChange={(open) => !open && setDeleteApp(null)}>
            <DialogContent className='w-[350px] md:w-[800px] rounded-lg'>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to delete this App? This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteApp(null)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteApp}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </CardContent>
      </Card>
    </main>
  )
}

export default AppVersionsPage