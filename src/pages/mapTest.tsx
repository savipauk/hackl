import { useState } from "react";
import dynamic from 'next/dynamic';
import MapErrorBoundary from '../components/mapErrorBoundary'

import "@/styles/globals.css";
import AdminHeader from "@/components/adminHeader";
import Footer from "@/components/footer";


const MapView = dynamic(
    () => import('../components/MapView'),
    { 
      ssr: false,
      loading: () => <p>Loading map...</p>
    }
  );

export default function Home() {
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex h-[15vh]">
        <AdminHeader
        />
      </div>
      <div className="flex h-[75vh]">¸
      <MapErrorBoundary>
        <MapView />
      </MapErrorBoundary>
      </div>
      <div className="flex h-[10vh]">

      <div>
      <h1>Locations in Zagreb</h1>
      
    </div>
        <Footer />
      </div>
    </div>
  );
}
