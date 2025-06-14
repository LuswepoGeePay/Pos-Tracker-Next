"use client"
import CreateAppVersionForm from '@/components/custom/forms/appvs/create-version-form'
import { useParams } from 'next/navigation'
import React from 'react'

const AddVersionPage = () => {
    const {appid} = useParams()


  return (
    <main className='m-8'>
        <CreateAppVersionForm appid={appid ? appid.toString() : ''}/>
    </main>
  )
}

export default AddVersionPage