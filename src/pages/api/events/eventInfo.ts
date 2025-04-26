import type { NextApiRequest, NextApiResponse } from 'next';
import { base, sanitizeFormulaValue } from '@/lib/airtable';
import type { FieldSet, Record as AirtableRecord } from 'airtable';
import { EventOutput} from '@/lib/types';
import Airtable from 'airtable';

interface AirtableRecordWithTime<TFields extends FieldSet> extends AirtableRecord<TFields> {
  createdTime: string;
}



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventOutput[] | { error: string; details?: string }>

) {if (req.method === 'GET') {
    try {
      const event_record: ReadonlyArray<AirtableRecord<FieldSet>> = await base('Event')
        .select({
          fields: ['Match Time', 'Match Date', 'Sport', 'Category', 'Location' , 'Home Team', 'Away Team', 'Home Team Score', 'Away Team Score', 'Location'],
        })
        .all();

      const events: EventOutput[] = event_record.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;
       
        return {
          id: recordWithTime.id,
          matchTime: String(recordWithTime.fields['Match Time'] || ''),
          matchDate: String(recordWithTime.fields['Match Date'] || ''),
          sport: String(recordWithTime.fields['Sport'] || ''),
          category: String(recordWithTime.fields['Category'] || ''),
          location: String(recordWithTime.fields['Location']),
          homeTeam: String(recordWithTime.fields['Home Team']),
          awayTeam: String(recordWithTime.fields['Away Team']),
          homeTeamScore: Number(recordWithTime.fields['Home Team Score']),
          awayTeamScore: Number(recordWithTime.fields['Away Team Score']),
          createdAt: recordWithTime.createdTime,
        };
      });

    return res.status(200).json(events);

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

      const sanitizedSportName = sanitizeFormulaValue(sport);
      const sanitizedCategory = sanitizeFormulaValue(category);
      // Build Airtable query with proper typing
      const queryConfig: Airtable.SelectOptions<FieldSet> = {
        fields:  ['Match Time', 'Match Date', 'Sport', 'Category', 'Location' , 'Home Team', 'Away Team', 'Home Team Score', 'Away Team Score', 'Location'],
        filterByFormula: `AND({Sport} = '${(sanitizedSportName)}', {Category} = '${(sanitizedCategory)}')`
      };
  
      // Execute filtered query
      const event_records = await base('Event')
        .select(queryConfig)
        .all();
  
      // Transform records
      const events = event_records.map((record) => {
        const recordWithTime = record as AirtableRecordWithTime<FieldSet>;

        return {
            id: recordWithTime.id,
            matchTime: String(recordWithTime.fields['Match Time'] || ''),
            matchDate: String(recordWithTime.fields['Match Date'] || ''),
            sport: String(recordWithTime.fields['Sport'] || ''),
            category: String(recordWithTime.fields['Category'] || ''),
            location: String(recordWithTime.fields['Location']),
            homeTeam: String(recordWithTime.fields['Home Team']),
            awayTeam: String(recordWithTime.fields['Away Team']),
            homeTeamScore: Number(recordWithTime.fields['Home Team Score']),
            awayTeamScore: Number(recordWithTime.fields['Away Team Score']),
            createdAt: recordWithTime.createdTime,
          };
        });

      return res.status(200).json(events);
  
    } catch (error) {
      console.error('Airtable error:', error);
      return res.status(500).json({
        error: 'Failed to fetch teams',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
}
}