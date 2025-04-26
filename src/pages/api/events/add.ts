import type { NextApiRequest, NextApiResponse } from 'next';
import { base, sanitizeFormulaValue } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { StatusOutput } from '@/lib/types';

// Define a minimal interface representing the expected Airtable record structure
// including createdTime, which might not be explicitly in AirtableRecord<FieldSet> type
interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}

export default async function handler(
  req: NextApiRequest,
  // Explicitly type the response body for better type safety
  res: NextApiResponse<StatusOutput | { error: string; details?: string }>
) {
  if (req.method === 'POST') {
    try {
      /*
        FKs:
        sport
        category
        location
        homeTeam
        awayTeam
        tournaments
      */
      const { matchTime, sport, category, matchDate, location, homeTeam, awayTeam } = req.body;
      if (!matchTime || !sport || !category || !matchDate || !location || !homeTeam || !awayTeam) {
        return res.status(400).json({ error: 'Missing matchTime, sport, category, matchDate, location, homeTeam or awayTeam in request body' });
      }

      const sanitizedMatchTime = sanitizeFormulaValue(matchTime);
      const sanitizedSport = sanitizeFormulaValue(sport);
      const sanitizedCategory = sanitizeFormulaValue(category);
      const sanitizedMatchDate = sanitizeFormulaValue(matchDate);
      const sanitizedLocation = sanitizeFormulaValue(location);
      const sanitizedHomeTeam = sanitizeFormulaValue(homeTeam);
      const sanitizedAwayTeam = sanitizeFormulaValue(awayTeam);

      const newRecord: AirtableRecord<FieldSet> = await base('Event').create([
        {
          fields: {
            'Match Time': sanitizedMatchTime,
            'Sport': [sanitizedSport],
            'Category': [sanitizedCategory],
            'Match Date': sanitizedMatchDate,
            'Location': [sanitizedLocation],
            'Home Team': [sanitizedHomeTeam],
            'Away Team': [sanitizedAwayTeam],
            // 'Home Team Score': "",
            // 'Away Team Score': "",
            // 'Match Result': "",
            // 'Officials': "",
            // 'Statistics': "",
            // 'Tournaments': "",
          }
        }
      ]).then(records => records[0]);

      // Return formatted response
      return res.status(201).json({
        status: "ok"
      });

    } catch (error) {
      // Log the detailed error on the server
      console.error('Airtable API error:', error);
      // Return a generic error message to the client
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return res.status(500).json({
        error: 'Failed to fetch sports data from Airtable.',
        details: errorMessage // Optionally include details in dev? Be careful in prod.
      });
    }
  }

  // If the request method is not GET (or POST if implemented)
  res.setHeader('Allow', ['GET']); // Adjust if you implement POST
  res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

