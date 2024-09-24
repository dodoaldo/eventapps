import React, { useEffect, useState, useMemo } from 'react';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  category: string;
  available_seats: number;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const currentDate = new Date();

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
      const matchesLocation = locationFilter ? event.location === locationFilter : true;

      const eventDate = new Date(event.date);
      const isUpcoming = eventDate >= currentDate;
      return matchesSearch && matchesCategory && matchesLocation && isUpcoming;
    });
  }, [events, debouncedSearchTerm, categoryFilter, locationFilter]);

  const pastEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate < currentDate;
    });
  }, [events, currentDate]);

  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>

      <input 
        type="text"
        placeholder="Events name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded mb-4"
      />

      <div className="mb-4">
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded mr-2"
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Tech">Tech</option>
          <option value="Art">Art</option>
          <option value="Sports">Sports</option>
        </select>
        
        <select 
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Locations</option>
          <option value="Bali">Bali</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Palembang">Palembang</option>
          <option value="Surabaya">Surabaya</option>
        </select>
      </div>

      {currentEvents.length === 0 ? (
        <p className="text-gray-600">Ooops, No Upcoming Events Available</p>
      ) : (
        <ul className="flex flex-wrap">
          {currentEvents.map((event) => (
            <li key={event.id} className="bg-gray-200 p-4 m-2 rounded w-full md:w-1/3 lg:w-1/4">
              <h2 className="text-xl">{event.name}</h2>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>Category: {event.category}</p>
              <p>Available Seats: {event.available_seats}</p>
              <a 
                href={`/events/${event.id}`} 
                className="mt-2 inline-block bg-blue-500 text-white rounded px-4 py-2 text-center"
              >
                Read More
              </a>
            </li>
          ))}
        </ul>
      )}

      <h1 className="text-2xl font-bold mb-4 mt-8">Past Events</h1>
      {pastEvents.length === 0 ? (
        <p className="text-gray-600">Ooops, No Past Events Available</p>
      ) : (
        <ul className="flex flex-wrap">
          {pastEvents.map((event) => (
            <li key={event.id} className="bg-gray-200 p-4 m-2 rounded w-full md:w-1/3 lg:w-1/4">
              <h2 className="text-xl">{event.name}</h2>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Location: {event.location}</p>
              <p>Category: {event.category}</p>
              <p>Available Seats: {event.available_seats}</p>
              <a 
                href={`/events/${event.id}`} 
                className="mt-2 inline-block bg-blue-500 text-white rounded px-4 py-2 text-center"
              >
                Read More
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;
