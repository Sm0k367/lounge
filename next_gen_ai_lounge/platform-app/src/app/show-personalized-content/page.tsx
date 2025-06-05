'use client'; // This directive indicates that this is a Client Component

import { useEffect, useState } from 'react';

interface Recommendation {
  type: string;
  id: string;
  title?: string; // Optional for types like 'performer_profile'
  name?: string;   // Optional for types like 'video'
}

interface PersonalizedData {
  userId: string;
  recommendations: Recommendation[];
  message: string;
}

export default function ShowPersonalizedContentPage() {
  const [data, setData] = useState<PersonalizedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/personalize');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e: any) {
        // Check if the error is likely due to a network issue (API not found)
        // or a specific HTTP error status that might indicate an unavailable API in static export
        if (e.message.toLowerCase().includes('failed to fetch') || (e.message.includes('HTTP error') && (e.message.includes('404') || e.message.includes('500')))) {
          setError('Dynamic content could not be loaded. This site may be a static version where API routes are not available, or the API is temporarily down.');
        } else {
          setError(e.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div style={{ padding: '20px' }}>Loading personalized content...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  if (!data) {
    return <div style={{ padding: '20px' }}>No personalized data available. This might occur if the content server is unreachable or if this is a static export.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Personalized Content</h1>
      <p><strong>User ID:</strong> {data.userId}</p>
      <p><strong>Message:</strong> {data.message}</p>

      <h2>Recommendations:</h2>
      {data.recommendations.length > 0 ? (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {data.recommendations.map((item, index) => (
            <li key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
              <strong style={{ textTransform: 'capitalize' }}>{item.type.replace('_', ' ')}:</strong>
              {item.title && <span> {item.title}</span>}
              {item.name && <span> {item.name}</span>}
              <br />
              <small style={{ color: '#555' }}>ID: {item.id}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
}
