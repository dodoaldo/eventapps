import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PurchaseTicket from './PurchaseTicket';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<any>(null);
  const [userTickets, setUserTickets] = useState<number>(0);
  const [review, setReview] = useState<string>(''); 
  const [rating, setRating] = useState<number>(1); 
  const [reviews, setReviews] = useState<any[]>([]); 
  const [canReview, setCanReview] = useState<boolean>(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
  
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        return response.json();
      })
      .then((data) => {
        setEvent(data);
        const eventDate = new Date(data.date);
        const today = new Date();
        if (userId && eventDate < today) {
          setCanReview(true); 
        }
      })
      .catch((error) => console.error('Error fetching event details:', error));
    
    if (userId) {
      fetch(`http://localhost:5000/api/events/${eventId}/tickets/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user tickets');
          }
          return response.json();
        })
        .then((data) => setUserTickets(data.totalTickets))
        .catch((error) => console.error('Error fetching user tickets:', error));
    }

    fetch(`http://localhost:5000/api/events/${eventId}/reviews`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch event reviews');
        }
        return response.json();
      })
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [eventId, userId]);

  const fetchReviews = () => {
    fetch(`http://localhost:5000/api/events/${eventId}/reviews`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch event reviews');
        }
        return response.json();
      })
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  };
  

const submitReview = () => {
  if (review.trim()) {
    fetch(`http://localhost:5000/api/events/${eventId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        rating,
        review,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
      return response.json();
    })
    .then(() => {
      alert('Review submitted successfully');
      setReview('');
      setRating(1);
      fetchReviews();
    })
    .catch((error) => console.error('Error submitting review:', error));
  } else {
    alert('Review cannot be empty');
  }
};

  if (!event) return <div className="p-4">Loading...</div>;

  return (
    <div className='py-24'>
      <div className="p-4 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4">{event.name}</h1>
        <p className="text-gray-700 mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-2"><strong>Location:</strong> {event.location}</p>
        <p className="text-gray-700 mb-2"><strong>Category:</strong> {event.category}</p>
        <p className="text-gray-700 mb-4"><strong>Description:</strong></p>
        <p className="text-gray-700 mb-4"><strong>Price:</strong> IDR {event.price}</p>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <p className="text-gray-700 mb-4"><strong>Available Seats:</strong> {event.available_seats}</p>

        {userId ? (
          <div>
            <p className="text-gray-700 mb-4"><strong>You have purchased:</strong> {userTickets} tickets</p>
            <div className="flex justify-center mb-8">
              <PurchaseTicket eventId={event.id} />
            </div>

            {canReview && (
              <div>
                <h2 className="text-xl font-bold mb-2">Leave a Review</h2>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border rounded-lg mb-4"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
                <textarea
                  className="w-full p-2 border rounded-lg mb-4"
                  placeholder="Write your review here"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={submitReview}
                >
                  Submit Review
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-red-500">
            <p>Please <span className="underline cursor-pointer text-blue-500" onClick={() => navigate('/login')}>log in</span> to purchase tickets or leave a review.</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Reviews</h2>
          {reviews.length > 0 ? (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="p-4 border rounded-lg">
                  <p><strong>User ID:</strong> {review.user_id}</p>
                  <p><strong>Rating:</strong> {review.rating} Stars</p>
                  <p>{review.review}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
