import type { NextApiRequest, NextApiResponse } from 'next';
import { base, sanitizeFormulaValue } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { CategoryOutput, SportInfoOutput, TournamentOutput } from '@/lib/types';

// Define a minimal interface representing the expected Airtable record structure
// including createdTime, which might not be explicitly in AirtableRecord<FieldSet> type
interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}

export default async function handler(
  req: NextApiRequest,
  // Explicitly type the response body for better type safety
  res: NextApiResponse<SportInfoOutput | { error: string; details?: string }>
) {
  if (req.method === 'POST') {
    try {
      const { sportName } = req.body;
      if (!sportName) {
        return res.status(400).json({ error: 'Missing sportName in request body' });
      }

      const sanitizedSportName = sanitizeFormulaValue(sportName);

      const category_records: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Category')
        .select({
          fields: ['Name'],
          filterByFormula: `{Sport} = '${sanitizedSportName}'`,
          sort: [{ field: 'Name', direction: 'asc' }],
        })
        .all();

      const categories: CategoryOutput[] = category_records.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;

        return {
          id: recordWithTime.id,

          category: String(recordWithTime.fields['Name'] || ''),

          createdAt: recordWithTime.createdTime,
        };
      });

      const tournament_records: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Tournaments')
        .select({
          fields: ['Tournament Name', 'Teams'],
          filterByFormula: `{Sport} = '${sanitizedSportName}'`,
          sort: [{ field: 'Tournament Name', direction: 'asc' }],
        })
        .all(); 

      const tournaments: TournamentOutput[] = tournament_records.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;

        return {
          id: recordWithTime.id,

          tournament: String(recordWithTime.fields['Tournament Name'] || ''),

          createdAt: recordWithTime.createdTime,
        };
      });

      const sportsInfo: SportInfoOutput = {
        categories: categories,
        tournaments: tournaments
      };

      // Return the transformed data
      return res.status(200).json(sportsInfo);

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
