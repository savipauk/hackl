import type { NextApiRequest, NextApiResponse } from 'next';
import { base, sanitizeFormulaValue } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { TeamOutput} from '@/lib/types';
import Airtable from 'airtable';

// Define a minimal interface representing the expected Airtable record structure
// including createdTime, which might not be explicitly in AirtableRecord<FieldSet> type
interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}

export default async function handler(
  req: NextApiRequest,
  // Explicitly type the response body for better type safety
  res: NextApiResponse<TeamOutput[] | { error: string; details?: string }>
) {
  if (req.method === 'GET') {
    try {/*
      const { teamName } = req.body;
      if (!teamName) {
        return res.status(400).json({ error: 'Missing teamName in request body' });
      }

      const sanitizedteamName = sanitizeFormulaValue(teamName);
*/
      const team_records: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Team')
        .select({
          fields: ['Team Name', 'Sport', 'Total Points', 'Team Logo', 'Category'],
         // filterByFormula: `{Team} = '${sanitizedteamName}'`,
         // sort: [{ field: 'Name', direction: 'asc' }],
        })
        .all();

      const teams: TeamOutput[] = team_records.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;
        const logoAttachment = recordWithTime.fields['Team Logo'] as Airtable.Attachment[] | undefined;

        return {
          id: recordWithTime.id,
          teamName: String(recordWithTime.fields['Team Name'] || ''),
          sport: String(recordWithTime.fields['Sport'] || ''),
          totalPoints: Number(recordWithTime.fields['Total Points'] || ''),
          logoUrl: logoAttachment?.[0]?.url,
          category: String(recordWithTime.fields['Category'] || ''),
          createdAt: recordWithTime.createdTime,
        };
      });



       

    return res.status(200).json(teams);

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

    if (req.method === 'POST') {
        try {
          const { category, sport } = req.body;
      
          // Build Airtable query with proper typing
          const queryConfig: Airtable.SelectOptions<FieldSet> = {
            fields: ['Team Name', 'Sport', 'Total Points', 'Team Logo', 'Category'],
            filterByFormula: `AND(
              ${category ? `FIND('${category}', ARRAYJOIN({Category}))` : '1=1'},
              ${sport ? `FIND('${sport}', ARRAYJOIN({Sport}))` : '1=1'}
            )`
          };
      
          // Execute filtered query
          const team_records = await base('Team')
            .select(queryConfig)
            .all();
      
          // Transform records
          const teams = team_records.map((record) => {
            const recordWithTime = record as AirtableRecordWithTime<FieldSet>;
            const logoAttachment = recordWithTime.fields['Team Logo'] as Airtable.Attachment[] | undefined;
      
            return {
              id: recordWithTime.id,
              teamName: String(recordWithTime.fields['Team Name'] || ''),
              sport: String(recordWithTime.fields['Sport'] || ''),
              totalPoints: Number(recordWithTime.fields['Total Points'] || 0),
              logoUrl: logoAttachment?.[0]?.url,
              category: String(recordWithTime.fields['Category'] || ''),
              createdAt: recordWithTime.createdTime,
            };
          });
      
          return res.status(200).json(teams);
      
        } catch (error) {
          console.error('Airtable error:', error);
          return res.status(500).json({
            error: 'Failed to fetch teams',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
}
