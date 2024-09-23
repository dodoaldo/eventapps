import React, { useState } from 'react';

const TicketPurchase: React.FC<{ eventId: string, availableSeats: number }> = ({ eventId, availableSeats }) => {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (numberOfTickets > availableSeats) {
      alert('Not enough available seats');
      return;
    }

    const purchaseDetails = {
      eventId,
      numberOfTickets,
    };

    fetch('http://localhost:5000/api/tickets/purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseDetails),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error purchasing tickets');
        return response.json();
      })
      .then(() => {
        setPurchaseSuccess(true);
        alert('Tickets purchased successfully!');
      })
      .catch((error) => console.error('Error purchasing tickets:', error));
  };

  return (
    <form onSubmit={handlePurchase} className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Purchase Tickets</h1>
      <div className="mb-4">
        <label className="block mb-1">Number of Tickets</label>
        <input
          type="number"
          value={numberOfTickets}
          onChange={(e) => setNumberOfTickets(+e.target.value)}
          min={1}
          max={availableSeats}
          required
          className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Purchase Tickets
      </button>
      {purchaseSuccess && <p className="mt-4 text-green-600">Purchase successful!</p>}
    </form>
  );
};

export default TicketPurchase;
