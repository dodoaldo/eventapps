import { Router } from 'express';
import { getEvents, createEvent, purchaseTicket, getEventById, getUserTicketsForEvent, addEventReview, getEventReviews } from '../controllers/eventController';

const router = Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.post('/purchase', purchaseTicket);
router.get('/:id', getEventById);
router.get('/:eventId/tickets/:userId', getUserTicketsForEvent);
router.get('/:id/reviews', getEventReviews);
router.post('/:id/reviews', addEventReview);

export default router;
