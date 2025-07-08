'use client';

import { Card, CardContent } from '@/components/ui/card';
import { api_endpoints } from '@/utils/api_constants';
import {
  CodeXml,
  LayoutPanelLeft,
  MapPinCheck,
  PowerOff,
  Smartphone,
  SmartphoneCharging,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardTiles = () => {
  const { data: session, status } = useSession();

  const [tileData, setTileData] = useState({
    pos_devices: 0,
    active_devices: 0,
    offline_devices: 0,
    apps: 0,
    app_version: 'N/A',
    new_locations: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTileInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(api_endpoints.getDashboardTileInfo, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const data = await res.json();
      console.log('Dashboard data:', data);

      if (data.status === 'success') {
        setTileData({
          pos_devices: data.info.pos_devices ?? 0,
          active_devices: data.info.active_devices ?? 0,
          offline_devices: data.info.offline_devices ?? 0,
          apps: data.info.apps ?? 0,
          app_version: data.info.app_version ?? 'N/A',
          new_locations: data.locations_tracked ?? 0,
        });
      } else {
        setError('Unable to fetch dashboard information.');
        toast.error('Failed to retrieve dashboard tiles.');
      }
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      setError('Something went wrong while loading tiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetchTileInfo();
    }
  }, [status, session?.accessToken]);

  const dynamicCardMetaData = [
    {
      id: '1',
      metric: 'Total POS Devices',
      value: tileData.pos_devices,
      icon: Smartphone,
      color: 'bg-blue-500',
    },
    {
      id: '2',
      metric: 'Active Devices (Today)',
      value: tileData.active_devices,
      icon: SmartphoneCharging,
      color: 'bg-green-500',
    },
    {
      id: '3',
      metric: 'Offline Devices',
      value: tileData.offline_devices,
      icon: PowerOff,
      color: 'bg-red-500',
    },
    {
      id: '4',
      metric: 'Registered Apps',
      value: tileData.apps,
      icon: CodeXml,
      color: 'bg-cyan-500',
    },
    {
      id: '5',
      metric: 'Latest App Version',
      value: tileData.app_version,
      icon: LayoutPanelLeft,
      color: 'bg-blue-500',
    },
    {
      id: '6',
      metric: 'New Locations Tracked (Today)',
      value: tileData.new_locations,
      icon: MapPinCheck,
      color: 'bg-lime-500',
    },
  ];

  return (
    <section className="w-full">
      {error ? (
        <div className="text-red-500 text-center font-semibold py-8">
          {error}
        </div>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading ? Array(6).fill(null) : dynamicCardMetaData).map((card, index) => (
            <Card key={index}>
              <CardContent className="flex gap-5 items-center py-6">
                {loading ? (
                  <>
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="flex flex-col items-end gap-4 w-full">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-6 w-1/3" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`${card.color} p-2 rounded-3xl text-white`}>
                      <card.icon />
                    </div>
                    <div className="flex flex-col items-end gap-5 w-full">
                      <p className="text-lg font-semibold text-end">{card.metric}</p>
                      <p className="text-xl font-bold">{card.value}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default DashboardTiles;
