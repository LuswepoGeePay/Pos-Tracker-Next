import DashboardChart from '@/components/custom/dashboard/dashboard-pie-chart'
import DasboardHeader from '@/components/custom/dashboard/dashboard-header'
import DashboardLineChart from '@/components/custom/dashboard/dashboard-line-chart'
import DashboardRecentEvents from '@/components/custom/dashboard/dashboard-recent-events'
import DasboardTiles from '@/components/custom/dashboard/dashboard-tiles'
import React from 'react'
import DashboardUsers from '@/components/custom/dashboard/dashboard-users'
import DashboardQuickActions from '@/components/custom/dashboard/dashboard-quick-actions'

const DasboardPage = () => {


  return (
    <main className='w-full flex flex-col gap-10 max-w-6xl m-8'>
      <DasboardHeader />
      <DasboardTiles />

     
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
       
        <DashboardChart />
        <DashboardLineChart />
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <DashboardQuickActions/>
        <DashboardRecentEvents />
      </div>
      <DashboardUsers/>

    </main>
  )
}

export default DasboardPage