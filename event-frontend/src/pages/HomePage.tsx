import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <img 
        src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?cs=srgb&dl=artists-audience-band-1763075.jpg&fm=jpg" 
        alt="Event Background" 
        className="absolute inset-0 w-full h-full object-cover z-[-1]" 
      />
      <div className="absolute inset-0 bg-black opacity-50 z-[-1]" />
      <main className="flex flex-col items-center justify-center text-white min-h-screen py-20 relative z-10">
        <h2 className="text-4xl font-bold mb-6">Discover and Attend Amazing Events</h2>
        <p className="text-xl mb-8">
          Join us to explore a world of events, from concerts to conferences, and everything in between.
        </p>
        <a
          href="/events"
          className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-lg shadow-lg transition duration-300"
        >
          Browse Events
        </a>
      </main>
    </div>
  );
};

export default HomePage;
