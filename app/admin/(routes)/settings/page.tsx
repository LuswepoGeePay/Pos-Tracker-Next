'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from 'next-auth/react';
import { api_endpoints } from '@/utils/api_constants';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter()

  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    id: '',
    role: '',
    status: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${api_endpoints.getUserInfo}${session?.id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const data = await res.json();
      console.log('data', data);

      if (data.status === 'success') {
        const user = data.data;

        setUserData({
          fullname: user.fullname ?? 'Not available',
          email: user.email ?? 'Not available',
          id: user.id ?? 'Not available',
          role: user.role ?? 'Not available',
          status: user.status ?? false,
        });
      } else {
        setError('Failed to retrieve user information.');
        toast.error('Unable to fetch user information.');
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchUserInfo();
    }
  }, [status, session?.accessToken]);

  return (
    <main>
      <Card>
        <CardContent className="flex flex-col md:flex-row gap-3 items-center ">
          {loading ? (
            <>
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
                <div className="space-x-6 md:space-y-6">
                  <Skeleton className="h-10 w-[140px]" />
                  <Skeleton className="h-10 w-[140px]" />
                </div>
              </div>
            </>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <Avatar className="h-[200px] w-[200px]">
                <AvatarImage
                  className="h-full w-full"
                  src="https://github.com/shadcn.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p>{userData.fullname}</p>
                <p>{userData.email}</p>
                <p>{userData.role}</p>
                <p>{userData.status ? 'Active' : 'Inactive'}</p>
                <div className="md:space-x-6 space-y-6 ">
                  <Button
                  onClick={()=> router.push(`/admin/settings/password/${userData.id}`)}
                  >Change Password</Button>
                  <Button
                   onClick={()=> router.push(`/admin/settings/email/${userData.id}`)}
                 
                  >Change Email</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default SettingsPage;
