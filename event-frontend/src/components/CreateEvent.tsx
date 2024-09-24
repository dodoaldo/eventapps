import React, { useState } from 'react';

const CreateEvent: React.FC = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [availableSeats, setAvailableSeats] = useState(0);
  const [price, setPrice] = useState(0);
  const [isPaidEvent, setIsPaidEvent] = useState(false);
  const [discountVoucher, setDiscountVoucher] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [maxUses, setMaxUses] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.role !== 'organizer') {
      alert('Only organizers can create events');
      return;
    }

    const confirmCreation = window.confirm('Are you sure you want to create this event?');
    if (!confirmCreation) {
      return;
    }

    const newEvent = {
      name,
      date,
      location,
      category,
      available_seats: availableSeats,
      price: isPaidEvent ? price : 0,
      is_paid: isPaidEvent,
      promotion: {
        discount_voucher: discountVoucher,
        valid_until: validUntil,
        max_uses: maxUses,
      },
      description,
    };

    fetch('http://localhost:5000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error creating event');
        return response.json();
      })
      .then(() => {
        setName('');
        setDate('');
        setLocation('');
        setCategory('');
        setAvailableSeats(0);
        setPrice(0);
        setIsPaidEvent(false);
        setDiscountVoucher('');
        setValidUntil('');
        setMaxUses(0);
        setDescription('');
        alert('Event created successfully!');
      })
      .catch((error) => console.error('Error creating event:', error));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Event</h1>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a category</option>
        <option value="Music">Music</option>
        <option value="Art">Art</option>
        <option value="Sports">Sports</option>
        <option value="Tech">Tech</option>
      </select>

      <textarea
        placeholder="Event Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div>Available Seats</div>
      <input
        type="number"
        placeholder="Available Seats"
        value={availableSeats}
        onChange={(e) => setAvailableSeats(+e.target.value)}
        required
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isPaidEvent}
          onChange={(e) => setIsPaidEvent(e.target.checked)}
          className="mr-2"
        />
        <label className="text-gray-700">Paid Event</label>
      </div>
      {isPaidEvent && (
        <input
          type="number"
          placeholder="Ticket Price (IDR)"
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          required
          className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
      <h2 className="text-lg font-semibold mt-6">Promotion Details</h2>
      <input
        type="text"
        placeholder="Discount Voucher"
        value={discountVoucher}
        onChange={(e) => setDiscountVoucher(e.target.value)}
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="date"
        value={validUntil}
        onChange={(e) => setValidUntil(e.target.value)}
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Max Uses"
        value={maxUses}
        onChange={(e) => setMaxUses(+e.target.value)}
        className="block w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Event
      </button>
    </form>
  );
};

export default CreateEvent;
