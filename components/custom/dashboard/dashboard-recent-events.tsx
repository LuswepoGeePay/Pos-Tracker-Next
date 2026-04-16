// "use client"
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Eye } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
// import { useSession } from 'next-auth/react'
// import { api_endpoints } from '@/utils/api_constants'
// import toast from 'react-hot-toast'

// type RawEvent = {
//   id: string
//   title: string
//   date: string
//   metadata: string // JSON string
// }

// type Event = {
//   id: string
//   title: string
//   date: string
//   metadata: Metadata
// }

// type Metadata = {
//   app_name?: string
//   description?: string
// }


// const DashboardRecentEvents = () => {
//   const [events, setEvents] = useState<Event[]>([])
//   const [open, setOpen] = useState(false)
//   const [selectedMetadata, setSelectedMetadata] = useState< Metadata | null>(null)
//   const { data: session, status } = useSession()

//   const fetchEvents = async () => {
//     try {
//        const body = {
//       page: 1,
//       pageSize: 10,
//     };

//       const res = await fetch(api_endpoints.getEvents, {
//         method:"POST",
//         headers: {
//           "Authorization": `Bearer ${session?.accessToken}`
//         },
//         body: JSON.stringify(body)
        
//       })
//       const data = await res.json()

//       if (data.status === 'success') {
//         const formatted = data.events.event.map((e: RawEvent) => {
//           const metadata = JSON.parse(e.metadata)
//           return {
//             id: e.id,
//             title: e.title,
//             metadata: metadata,
//             date: new Date(e.date).toLocaleString(), // format to readable date
//           }
//         })
//         setEvents(formatted)

//       } else if (data.status == "failure") {
//         toast.error("Unable to fetch recent events")
//       }
//     } catch (err) {
//       console.error('Failed to fetch dashboard info:', err)
//     }
//   }

//   useEffect(() => {
//     // Mocking the API response (replace this with actual fetch call)

//     if (status === 'authenticated' && session?.accessToken) {
//       fetchEvents()
//     }
//   }, [status, session?.accessToken,])

//   const handleOpenDialog = (metadata: Metadata) => {
//     setSelectedMetadata(metadata)
//     setOpen(true)
//   }

//   return (
//     <>
//       <Card className='max-h-[350px] '>
//         <CardHeader className='font-semibold '>Recent Events</CardHeader>
//         <CardContent className='flex flex-col gap-3 overflow-y-auto max-h-[250px] pr-2'>
//           {events.map((event, index) => (
//             <div key={index} className='flex justify-between items-start'>
//               <div>
//                 <p className='text-md font-medium'>{event.title}</p>
//                 <p className='text-sm text-gray-500'>{event.date}</p>
//               </div>
//               <Eye size={40}
//                 onClick={() => handleOpenDialog(event.metadata)}
//                 className='hover:cursor-pointer text-blue-600 bg-gray-300 rounded-2xl p-3'

//               />
//             </div>
//           ))}
//         </CardContent>
//       </Card>


//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Event Metadata</DialogTitle>
//             <DialogDescription>This data came from the event payload.</DialogDescription>
//           </DialogHeader>
//           {selectedMetadata && (
//             <div className="mt-4 space-y-2">
//               {Object.entries(selectedMetadata).map(([key, value]) => (
//                 <p key={key}>
//                   <strong className="capitalize">{key}:</strong> {String(value)}
//                 </p>
//               ))}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>

//   )
// }

// export default DashboardRecentEvents
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useSession } from 'next-auth/react';
import { api_endpoints } from '@/utils/api_constants';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

type RawEvent = {
  id: string;
  title: string;
  date: string;
  metadata: string;
};

type Event = {
  id: string;
  title: string;
  date: string;
  metadata: Metadata;
};

type Metadata = {
  app_name?: string;
  description?: string;
};

const DashboardRecentEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedMetadata, setSelectedMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: '1',
        pageSize: '10',
      });

      const res = await fetch(`${api_endpoints.getEvents}?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const data = await res.json();

      if (data.status === 'success') {
        const formatted = data.events.event.map((e: RawEvent) => {
          const metadata = JSON.parse(e.metadata);
          return {
            id: e.id,
            title: e.title,
            metadata,
            date: new Date(e.date).toLocaleString(),
          };
        });
        setEvents(formatted);
      } else {
        setError('Unable to fetch recent events.');
        toast.error('Failed to fetch recent events.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchEvents();
    }
  }, [status, session?.accessToken]);

  const handleOpenDialog = (metadata: Metadata) => {
    setSelectedMetadata(metadata);
    setOpen(true);
  };

  return (
    <>
      <Card className="max-h-[350px]">
        <CardHeader className="font-semibold">Recent Events</CardHeader>
        <CardContent className="flex flex-col gap-3 overflow-y-auto max-h-[250px] pr-2">
          {loading ? (
            Array(4)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex justify-between items-start gap-4">
                  <div className="w-full">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              ))
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            events.map((event, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="text-md font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">{event.date}</p>
                </div>
                <Eye
                  size={40}
                  onClick={() => handleOpenDialog(event.metadata)}
                  className="hover:cursor-pointer text-blue-600 bg-gray-300 rounded-2xl p-3"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Metadata</DialogTitle>
            <DialogDescription>This data came from the event payload.</DialogDescription>
          </DialogHeader>
          {selectedMetadata && (
            <div className="mt-4 space-y-2">
              {Object.entries(selectedMetadata).map(([key, value]) => (
                <p key={key}>
                  <strong className="capitalize">{key}:</strong> {String(value)}
                </p>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardRecentEvents;
