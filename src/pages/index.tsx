import { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';
import { useState } from 'react';
import "@/styles/globals.css"

type Event = { id: number; name: string; date: string };

export default function Home({ events }: { events: Event[] }) {
  const [list, setList] = useState(events);

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.name.valueOf;
    const date = form.date.value;
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date }),
    });
    const newEvent = await res.json();
    setList((prev) => [...prev, newEvent]);
    form.reset();
  }

  return (
    <div className="form max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sports Events</h1>
      <ul className="space-y-2 mb-6">
        {list.map((ev) => (
          <li key={ev.id} className="p-2 border rounded">
            <strong>{ev.name}</strong> — {new Date(ev.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <form onSubmit={addEvent} className="space-y-2">
        <input name="name" placeholder="Event name" required className="w-full p-2 border rounded" />
        <input name="date" type="date" required className="w-full p-2 border rounded" />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Add Event
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
  return { props: { events: JSON.parse(JSON.stringify(events)) } };
};


