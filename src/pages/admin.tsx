import "@/styles/globals.css";
import AdminHeader from "@/components/adminHeader";
import Footer from "@/components/footer";
import { EventOutput } from "@/lib/types";
import AdminPastEvent from "@/components/adminPastEvent";
import { useState, useEffect } from "react";

export default function Admin() {
  const [events, setEvents] = useState<EventOutput[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EventOutput[] = await response.json();

        setEvents(data);
      } catch (err) {
        setEvents([]);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex min-h-[15vh]">
        <AdminHeader />
      </div>
      <div className="flex min-h-[75vh]">
        {events.map((event: EventOutput) => (
          <div>
            <AdminPastEvent event={event} />
          </div>
        ))}
      </div>
      <div className="flex min-h-[10vh]">
        <Footer />
      </div>
    </div>
  );
}
