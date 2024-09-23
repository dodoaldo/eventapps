"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const router = (0, express_1.Router)();
router.get('/', eventController_1.getEvents);
router.post('/', eventController_1.createEvent);
router.post('/purchase', eventController_1.purchaseTicket);
router.get('/:id', eventController_1.getEventById);
router.get('/:id/tickets/:userId', eventController_1.getUserTicketsForEvent);
router.get('/:id/reviews', eventController_1.getEventReviews);
router.post('/:id/reviews', eventController_1.addEventReview);
exports.default = router;
