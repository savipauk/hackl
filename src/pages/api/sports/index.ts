import type { NextApiRequest, NextApiResponse } from 'next';
import { base } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { SportOutput } from '@/lib/types';

// Define a minimal interface representing the expected Airtable record structure
// including createdTime, which might not be explicitly in AirtableRecord<FieldSet> type
interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}

export default async function handler(
  req: NextApiRequest,
  // Explicitly type the response body for better type safety
  res: NextApiResponse<SportOutput[] | { error: string; details?: string }>
) {
  if (req.method === 'GET') {
    try {
      // Fetch records from Airtable.
      // The actual type here is ReadonlyArray<AirtableRecord<FieldSet>>.
      const records: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Sport')
        .select({
          // Specify the fields you need from Airtable
          fields: ['Sport Name'],
          // Specify sorting
          sort: [{ field: 'Sport Name', direction: 'asc' }],
        })
        .all(); // This returns ReadonlyArray<AirtableRecord<FieldSet>> 

      // Map the raw Airtable records to your desired output structure (SportOutput)
      const sports: SportOutput[] = records.map((record) => {
        // Assert the record type to include createdTime
        // We know from Airtable's API that .all() includes createdTime
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;

        return {
          id: recordWithTime.id,

          sportName: String(recordWithTime.fields['Sport Name'] || ''),

          createdAt: recordWithTime.createdTime,
        };
      });

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

