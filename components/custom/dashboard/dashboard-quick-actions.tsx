import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Code2, LayoutPanelLeft, User } from 'lucide-react'
import React from 'react'



const quickActions = [
  {
    "title": "Add new user",
    "path": "/admin/users",
    "icon": User,
    "color": "bg-green-700",
  },
  {
    "title": "Upload New App Version",
    "path": "/admin/apps",
    "icon": Code2,
    "color": "bg-blue-500",
  },
  {
    "title": "Export Reports",
    "path": "/admin/apps",
    "icon": LayoutPanelLeft,
    "color": "bg-blue-500",
  },
]

const DashboardQuickActions = () => {
  return (
    <Card className='h-fit'>
      <CardHeader className='font-semibold'>Quick Actions</CardHeader>
      <CardContent>

        <div className='grid grid-cols-2 gap-5'>
          {quickActions.map((action, index) => (
            <Button
              className={`${action.color}`}
              key={index}
            >
              <action.icon /> {action.title}
            </Button>))

          }

        </div>
      </CardContent>
    </Card>

  )
}

export default DashboardQuickActions