import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const SettingsPage = () => {
  return (
    <main>
      <Card>
        <CardContent className='flex  gap-3 items-center justify-center'>

          <Avatar  className='h-[200px] w-[200px]'>
            <AvatarImage 
            className='h-full w-full'
            src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className='space-y-2'>
            <p>Your Name</p>
            <p>Your email</p>
            <p>Your role</p>
            <div className='space-x-6'>
     <Button>Change Password</Button>
            <Button>Change Email</Button>

            </div>
       
          </div>


        </CardContent>
      </Card>
    </main>
  );
};

export default SettingsPage;
