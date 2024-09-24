"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventReview = exports.getEventReviews = exports.getUserTicketsForEvent = exports.getEventById = exports.purchaseTicket = exports.createEvent = exports.getEvents = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const connection = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "Dodoaldo2",
    database: "event_db",
});
const getEvents = (req, res) => {
    connection.query("SELECT * FROM events", (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};
exports.getEvents = getEvents;
const createEvent = (req, res) => {
    const { name, date, location, category, available_seats } = req.body;
    const query = "INSERT INTO events (name, date, location, category, available_seats) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, [name, date, location, category, available_seats], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        const insertId = results.insertId;
        res.status(201).json({
            id: insertId,
            name,
            date,
            location,
            category,
            available_seats,
        });
    });
};
exports.createEvent = createEvent;
const purchaseTicket = (req, res) => {
    const { event_id, user_id, quantity } = req.body;
    const purchaseDate = new Date();
    connection.query("SELECT available_seats FROM events WHERE id = ?", [event_id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }
        const availableSeats = results[0].available_seats;
        if (availableSeats < quantity) {
            return res.status(400).json({ message: "Not enough available seats" });
        }
        connection.query("UPDATE events SET available_seats = available_seats - ? WHERE id = ?", [quantity, event_id], (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            const query = "INSERT INTO ticket_purchases (event_id, user_id, quantity, purchase_date) VALUES (?, ?, ?, ?)";
            connection.query(query, [event_id, user_id, quantity, purchaseDate], (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res
                    .status(201)
                    .json({ message: "Ticket purchased successfully" });
            });
        });
    });
};
exports.purchaseTicket = purchaseTicket;
const getEventById = (req, res) => {
    const { id } = req.params;
    connection.query("SELECT * FROM events WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (Array.isArray(results) && results.length > 0) {
            return res.json(results[0]);
        }
        else {
            return res.status(404).send("Event not found");
        }
    });
};
exports.getEventById = getEventById;
const getUserTicketsForEvent = (req, res) => {
    const { eventId, userId } = req.params;
    const query = "SELECT SUM(quantity) AS total_tickets FROM ticket_purchases WHERE event_id = ? AND user_id = ?";
    connection.query(query, [eventId, userId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            const totalTickets = results[0].total_tickets || 0;
            return res.json({ totalTickets });
        }
        else {
            return res.status(404).json({ message: "No tickets found" });
        }
    });
};
exports.getUserTicketsForEvent = getUserTicketsForEvent;
const getEventReviews = (req, res) => {
    const { id } = req.params;
    connection.query("SELECT user_id, rating, review FROM reviews WHERE event_id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.json(results);
        }
        else {
            return res.status(404).json({ message: "No reviews found" });
        }
    });
};
exports.getEventReviews = getEventReviews;
const addEventReview = (req, res) => {
    const { id } = req.params;
    const { userId, rating, review } = req.body;
    const insertQuery = "INSERT INTO reviews (event_id, user_id, rating, review) VALUES (?, ?, ?, ?)";
    connection.query(insertQuery, [id, userId, rating, review], (err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to submit review", error: err });
        }
        return res.status(201).json({ message: "Review added successfully" });
    });
};
exports.addEventReview = addEventReview;
