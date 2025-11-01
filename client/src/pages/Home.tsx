import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import api from '../api';
import type { Experience } from '../types';
import ExperienceCard from '../components/ExperienceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the search params from the URL
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('search'); // e.g., "kayak" or null

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);

        // Build the URL with the search query if it exists
        let url = '/experiences';
        if (searchTerm) {
          url += `?search=${searchTerm}`;
        }

        const response = await api.get(url);
        setExperiences(response.data);
      } catch (err) {
        setError('Failed to fetch experiences. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [searchTerm]); // Re-run this effect every time the searchTerm changes

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Show a message if there are search results */}
      {searchTerm && (
        <h2 className="text-2xl font-semibold">
          Showing results for "{searchTerm}"
        </h2>
      )}

      {/* Show a message if no results are found */}
      {experiences.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">No results found</h2>
          <p className="text-zinc-600">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'There are no experiences available at this time.'}
          </p>
        </div>
      )}

      {/* Show the grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {experiences.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
};

export default Home;