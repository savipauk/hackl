import Airtable from 'airtable';

export const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY!
}).base(process.env.AIRTABLE_BASE_ID!);

// Generic record type for basic type hinting
export type AirtableRecord<T = any> = {
  id: string
  fields: T
  createdTime: string
}
