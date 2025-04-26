import type { NextApiRequest, NextApiResponse } from 'next';
import { base, sanitizeFormulaValue } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { LocationsOutput } from '@/lib/types';

// Define a minimal interface representing the expected Airtable record structure
// including createdTime, which might not be explicitly in AirtableRecord<FieldSet> type
interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}

export default async function handler(
  req: NextApiRequest,
  // Explicitly type the response body for better type safety
  res: NextApiResponse<LocationsOutput[] | { error: string; details?: string }>
) {
  if (req.method === 'POST') {
    try {
      const { sportName } = req.body;
      if (!sportName) {
        return res.status(400).json({ error: 'Missing sportName in request body' });
      }

      const sanitizedSportName = sanitizeFormulaValue(sportName);

      const location_records: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Locations')
        .select({
          fields: ['Venue Name', 'Address', 'Capacity', 'Facilities', 'Photo', 'Matches Hosted', 'Tournaments Hosted', 'Sport'],
          filterByFormula: `{Sport} = '${sanitizedSportName}'`,
          sort: [{ field: 'Venue Name', direction: 'asc' }],
        })
        .all();

      const locations: LocationsOutput[] = location_records.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;

        return {
          id: recordWithTime.id,

          venueName: String(recordWithTime.fields['Venue Name'] || ''),
          address: String(recordWithTime.fields['Address'] || ''),
          capacity: String(recordWithTime.fields['Capacity'] || ''),
          facilities: String(recordWithTime.fields['Facilities'] || ''),
          photo: String(recordWithTime.fields['Photo'] || ''),
          matchesHosted: String(recordWithTime.fields['Matches Hosted'] || ''),
          tournamentsHosted: String(recordWithTime.fields['Tournaments Hosted'] || ''),
          sport: String(recordWithTime.fields['Sport'] || ''),

          createdAt: recordWithTime.createdTime,
        };
      });

      // Return the transformed data
      return res.status(200).json(locations);

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
