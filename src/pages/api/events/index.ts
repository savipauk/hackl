import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    return res.status(200).json(events);
  }
  if (req.method === 'POST') {
    const { name, date } = req.body;
    const event = await prisma.event.create({
      data: { name, date: new Date(date) },
    });
    return res.status(201).json(event);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

