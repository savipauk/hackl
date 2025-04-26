import type { NextApiRequest, NextApiResponse } from 'next';
import { base, sanitizeFormulaValue } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { TeamInformation } from '@/lib/types';
import Airtable from 'airtable';

// Define a minimal interface representing the expected Airtable record structure
// including createdTime, which might not be explicitly in AirtableRecord<FieldSet> type
interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}

export default async function handler(
  req: NextApiRequest,
  // Explicitly type the response body for better type safety
  res: NextApiResponse<TeamInformation[] | { error: string; details?: string }>
) {
  if (req.method === 'POST') {
    try {
      const { teamId } = req.body;
      if (!teamId) {
        return res.status(400).json({ error: 'Missing teamId in request body' });
      }

      const sanitizedId = sanitizeFormulaValue(teamId);

      const sport_records: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Team')
        .select({
          fields: ['Team Name', 'Category', 'Sport', 'Team Logo', 'Members', 'Wins', 'Losses', 'Draws', 'Total Points', 'Team Record', 'Tournaments Participated', 'Matches (Home Team)', 'Matches (Away Team)'],
          filterByFormula: `RECORD_ID() = '${sanitizedId}'`,
          sort: [{ field: 'Team Name', direction: 'asc' }],
        })
        .all();

      const teamInformation: TeamInformation[] = sport_records.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;
        const logoAttachment = recordWithTime.fields['Team Logo'] as Airtable.Attachment[] | undefined;

        return {
          id: recordWithTime.id,

          teamName: String(recordWithTime.fields['Team Name'] || ''),
          category: String(recordWithTime.fields['Category'] || ''),
          sport: String(recordWithTime.fields['Sport'] || ''),
          teamLogo: logoAttachment?.[0]?.url,
          members: String(recordWithTime.fields['Members'] || ''),
          wins: String(recordWithTime.fields['Wins'] || ''),
          losses: String(recordWithTime.fields['Losses'] || ''),
          draws: String(recordWithTime.fields['Draws'] || ''),
          totalPoints: String(recordWithTime.fields['Total Points'] || ''),
          teamRecord: String(recordWithTime.fields['Team Record'] || ''),
          tournamentsParticipated: String(recordWithTime.fields['Tournaments Participated'] || ''),
          matchesHomeTeam: String(recordWithTime.fields['Matches (Home Team)'] || ''),
          matchesAwayTeam: String(recordWithTime.fields['Matches (Away Team)'] || ''),

          createdAt: recordWithTime.createdTime,
        };
      })

      // Return the transformed data
      return res.status(200).json(teamInformation);

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
