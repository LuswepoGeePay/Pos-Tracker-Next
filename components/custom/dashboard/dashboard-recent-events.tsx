import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Eye } from 'lucide-react'
import React from 'react'


const events = [
  {
    "title": "New Device Registered",
    "date": "12th June 2025",
  },
  {
    "title": "App version updated",
    "date": "12th June 2025",
  },
  {
    "title": "User logged in",
    "date": "12th June 2025",
  },
  {
    "title": "Device went offline",
    "date": "12th June 2025",
  },
  {
    "title": "Location geofence breach",
    "date": "12th June 2025",
  },

]

const DashboardRecentEvents = () => {
  return (

    <Card>
      <CardHeader className='font-semibold'>Recent Events</CardHeader>
      <CardContent className='flex flex-col gap-3'>
        {events.map((event, index) => (
          <div key={index} className='flex justify-between'>
            <div>
              <p className='text-md'>{event.title}</p>
              <p className='text-sm'>{event.date}</p>
            </div>
            <Eye size={40} className='hover:cursor-pointer text-blue-600 bg-gray-300 rounded-2xl p-3' />
          </div>
        ))

        }
      </CardContent>
    </Card>

  )
}

export default DashboardRecentEvents