import { GetServerSideProps } from 'next';
import { useState } from 'react';
import type { FormEvent } from 'react'; // Import FormEvent type
import "@/styles/globals.css" // Assuming you have global styles

// Define the type for a Sport based on the API response
// Matches the SportOutput type from the API route
type Sport = {
  id: string; // Airtable IDs are strings
  sportName: string;
  description: string;
  createdAt: string; // ISO date string from Airtable
};

// Define the props for the Home component
interface HomeProps {
  initialSports: Sport[];
  error?: string; // Optional error message from server-side fetch
}

export default function Home({ initialSports, error }: HomeProps) {
  // State to hold the list of sports
  const [sportsList, setSportsList] = useState<Sport[]>(initialSports);
  // State to manage loading status for form submission
  const [isLoading, setIsLoading] = useState(false);
  // State to manage feedback messages
  const [message, setMessage] = useState<string | null>(error || null); // Display initial error if any

  // Function to handle form submission (currently won't add to Airtable)
  async function addSport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null); // Clear previous messages

    const form = e.currentTarget; // Use currentTarget for type safety
    // Correctly get form input values
    const nameInput = form.elements.namedItem('sportName') as HTMLInputElement | null;
    const descriptionInput = form.elements.namedItem('description') as HTMLInputElement | null;

    const sportName = nameInput?.value;
    const description = descriptionInput?.value;

    // Basic client-side validation
    if (!sportName || !description) {
        setMessage("Please fill out both sport name and description.");
        setIsLoading(false);
        return;
    }

    try {
      // Attempt to POST to the API route
      const res = await fetch('/api/sports', { // Target the correct API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send data matching potential Airtable fields (adjust if needed)
        body: JSON.stringify({ 'Sport Name': sportName, 'Description': description }),
      });

      // Check if the API route handled the POST (it currently doesn't)
      if (!res.ok) {
        // If the status is 405 (Method Not Allowed) or 501 (Not Implemented)
        if (res.status === 405 || res.status === 501) {
            setMessage('Adding new sports is not implemented yet.');
            console.warn('POST request to /api/sports failed: Method not implemented on the server.');
        } else {
            // Handle other potential errors from the API
            const errorData = await res.json();
            setMessage(`Error: ${errorData.error || res.statusText}`);
            console.error('API Error:', errorData);
        }
      } else {
         // If POST *were* implemented successfully (hypothetical)
         // const newSport = await res.json();
         // setSportsList((prev) => [...prev, newSport]); // Optimistic update (won't run with current API)
         setMessage('Sport added successfully! (Simulation - POST not implemented)'); // Placeholder message
         form.reset(); // Reset form on success
      }

    } catch (fetchError) {
      console.error('Failed to submit form:', fetchError);
      setMessage('Failed to send data. Check the console.');
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  }

  // Function to refresh the sports list from the server
  async function refreshSports() {
    setMessage('Refreshing...');
    try {
        const res = await fetch('/api/sports');
        if (!res.ok) {
            throw new Error(`API Error: ${res.statusText}`);
        }
        const data: Sport[] = await res.json();
        setSportsList(data);
        setMessage('Sports list updated.');
    } catch (err) {
        console.error("Failed to refresh sports:", err);
        setMessage(err instanceof Error ? err.message : 'Failed to refresh sports.');
    }
  }


  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sports from Airtable</h1>

      {/* Display Message/Error Area */}
      {message && (
        <div className={`p-3 mb-4 rounded text-center ${error || message.startsWith('Error') || message.startsWith('Failed') || message.startsWith('Adding') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {message}
        </div>
      )}

      {/* Sports List */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Available Sports</h2>
            <button
                onClick={refreshSports}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                disabled={message === 'Refreshing...'} // Disable while refreshing
            >
                Refresh List
            </button>
        </div>
        {sportsList.length > 0 ? (
          <ul className="space-y-3">
            {sportsList.map((sport) => (
              <li key={sport.id} className="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                <p className="font-semibold text-lg text-indigo-700">{sport.sportName}</p>
                <p className="text-gray-600 text-sm mb-1">{sport.description}</p>
                <p className="text-gray-400 text-xs">
                  Added: {new Date(sport.createdAt).toLocaleDateString()} {/* Format the date */}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No sports found.</p>
        )}
      </div>


      {/* Add Sport Form */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add a New Sport (Not Implemented)</h2>
        <form onSubmit={addSport} className="space-y-4">
          <input
            name="sportName" // Changed name to match API/Airtable expectation
            placeholder="Sport name"
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <textarea
            name="description" // Added description field
            placeholder="Description"
            required
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Adding...' : 'Add Sport'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Fetch initial data on the server
export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  // Determine the base URL for the API call
  // IMPORTANT: Replace 'http://localhost:3000' with your actual deployment URL in production
  const protocol = context.req.headers['x-forwarded-proto'] || 'http';
  const host = context.req.headers.host || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch data from your API route
    const res = await fetch(`${baseUrl}/api/sports`); // Use the correct API endpoint

    if (!res.ok) {
      // If the API returns an error, pass it to the page
      const errorData = await res.json().catch(() => ({ error: `API responded with status ${res.status}` }));
      console.error(`SSR Fetch Error (${res.status}):`, errorData.error || res.statusText);
      return { props: { initialSports: [], error: `Failed to load sports: ${errorData.error || res.statusText}` } };
    }

    const initialSports: Sport[] = await res.json();

    // Pass data to the page via props
    return { props: { initialSports } };

  } catch (error) {
    console.error('SSR Fetch failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    // Return empty data and an error message if fetch fails
    return { props: { initialSports: [], error: `Server error: ${errorMessage}` } };
  }
};

