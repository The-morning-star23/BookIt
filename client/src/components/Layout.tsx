import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  // Add state to hold the search text
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // This function runs when the user submits the search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading
    if (!searchTerm) return; // Don't search for empty string

    // Navigate to the home page with a search query
    // e.g., /?search=kayak
    navigate(`/?search=${searchTerm}`);
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="w-full h-[87px] bg-[#F9F9F9] py-4 px-[124px] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.1)]">
        <nav className="flex h-full items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Highway Delite Logo"
              className="w-[100px] h-[55px] object-contain"
            />
          </Link>

          {/* --- SEARCH BAR & BUTTON --- */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Search experiences"
              value={searchTerm} // Controlled component
              onChange={(e) => setSearchTerm(e.target.value)} // Update state
              className="
                w-[340px] h-[42px] 
                rounded 
                bg-[#EDEDED] 
                py-3 px-4 
                text-sm 
                placeholder:text-[#727272]
                focus:outline-none focus:ring-2 focus:ring-[#FFD643]
              "
            />
            <button
              type="submit" // Make this a submit button
              className="
                h-[42px] w-[87px] 
                rounded-lg 
                bg-[#FFD643] 
                py-3 px-5 
                text-sm font-medium text-black
                hover:bg-primary-hover
              "
            >
              Search
            </button>
          </form>
        </nav>
      </header>

      <main className="mx-auto max-w-[1440px] px-[124px] py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;