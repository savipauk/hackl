import type { NextApiRequest, NextApiResponse } from 'next';
import { base, sanitizeFormulaValue } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { Sport } from '@/lib/types';

// Define a minimal interface representing the expected Airtable record structure
// including createdTime, which might not be explicitly in AirtableRecord<FieldSet> type
interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}

export default async function handler(
  req: NextApiRequest,
  // Explicitly type the response body for better type safety
  res: NextApiResponse<Sport[] | { error: string; details?: string }>
) {
  if (req.method === 'POST') {
    try {
      const { sportId } = req.body;
      if (!sportId) {
        return res.status(400).json({ error: 'Missing sportId in request body' });
      }

      const sanitizedId = sanitizeFormulaValue(sportId);

      const sport_records: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Sport')
        .select({
          fields: ['Sport Name', 'Description', 'Teams Participating', 'Venues Used', 'Matches Scheduled', 'Players Involved', 'Tournaments', 'Officials Assigned', 'Statistics Available', 'Category'],
          filterByFormula: `RECORD_ID() = '${sanitizedId}'`,
          sort: [{ field: 'Sport Name', direction: 'asc' }],
        })
        .all();

      const sports: Sport[] = sport_records.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;
        return {
          id: recordWithTime.id,

          sportName: String(recordWithTime.fields['Sport Name'] || ''),
          description: String(recordWithTime.fields['Description'] || ''),
          teamsParticipating: String(recordWithTime.fields['Teams Participating'] || ''),
          venuesUsed: String(recordWithTime.fields['Venues Used'] || ''),
          matchesScheduled: String(recordWithTime.fields['Matches Scheduled'] || ''),
          playersInvolved: String(recordWithTime.fields['Players Involved'] || ''),
          tournaments: String(recordWithTime.fields['Tournaments'] || ''),
          officialsAssigned: String(recordWithTime.fields['Officials Assigned'] || ''),
          statisticsAvailable: String(recordWithTime.fields['Statistics Available'] || ''),
          category: String(recordWithTime.fields['Category'] || ''),

          createdAt: recordWithTime.createdTime,
        };
      })

      // Return the transformed data
      return res.status(200).json(sports);

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
