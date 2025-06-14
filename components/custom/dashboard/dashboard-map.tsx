'use client'
import dynamic from 'next/dynamic';
import React from 'react';

// Import the leaflet styles globally at app level or here
import 'leaflet/dist/leaflet.css';

const Map = dynamic(() => import('./Map/map'), { ssr: false });

interface DashboardMapProps {
  center: [number, number];
  zoom: number;
}

const DashboardMap: React.FC<DashboardMapProps> = ({ center, zoom }) => {
  return (
    <div className="h-[500px] w-full"> {/* Set a fixed height */}
      <Map center={center} zoom={zoom} />
    </div>
  );
};

export default DashboardMap;
