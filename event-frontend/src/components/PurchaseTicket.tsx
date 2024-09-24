import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface PurchaseTicketProps {
  eventId: number;
}

const PurchaseTicket: React.FC<PurchaseTicketProps> = ({ eventId }) => {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const handlePurchase = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setMessage("Please log in to purchase tickets.");
      return;
    }

    const result = await Swal.fire({
      title: 'Konfirmasi Pembelian',
      text: `Apakah Anda yakin ingin membeli ${quantity} tiket?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yakin',
      cancelButtonText: 'Tidak',
    });

    if (result.isConfirmed) {
      const response = await fetch('http://localhost:5000/api/events/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: userId,
          quantity,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        Swal.fire('Berhasil!', data.message, 'success');
      } else {
        setMessage(data.message);
        Swal.fire('Gagal!', data.message, 'error');
      }
    } else {
      Swal.fire('Dibatalkan', 'Pembelian tiket dibatalkan.', 'info');
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Purchase Tickets</h2>
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border rounded p-2 w-16"
      />
      <button
        onClick={handlePurchase}
        className="ml-2 bg-blue-500 text-white rounded px-4 py-2"
      >
        Buy Tickets
      </button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default PurchaseTicket;
