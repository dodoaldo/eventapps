import { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dodoaldo2",
  database: "event_db",
});

export const getEvents = (req: Request, res: Response) => {
  connection.query("SELECT * FROM events", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
};

export const createEvent = (req: Request, res: Response) => {
  const { name, date, location, category, available_seats } = req.body;
  const query =
    "INSERT INTO events (name, date, location, category, available_seats) VALUES (?, ?, ?, ?, ?)";

  connection.query(
    query,
    [name, date, location, category, available_seats],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      const insertId = (results as mysql.ResultSetHeader).insertId;

      res.status(201).json({
        id: insertId,
        name,
        date,
        location,
        category,
        available_seats,
      });
    }
  );
};

export const purchaseTicket = (req: Request, res: Response) => {
  const { event_id, user_id, quantity } = req.body;
  const purchaseDate = new Date();

  connection.query<RowDataPacket[]>(
    "SELECT available_seats FROM events WHERE id = ?",
    [event_id],
    (err, results) => {
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

    
      connection.query(
        "UPDATE events SET available_seats = available_seats - ? WHERE id = ?",
        [quantity, event_id],
        (err) => {
          if (err) {
            return res.status(500).send(err);
          }

          const query =
            "INSERT INTO ticket_purchases (event_id, user_id, quantity, purchase_date) VALUES (?, ?, ?, ?)";
          connection.query(
            query,
            [event_id, user_id, quantity, purchaseDate],
            (err) => {
              if (err) {
                return res.status(500).send(err);
              }

              res
                .status(201)
                .json({ message: "Ticket purchased successfully" });
            }
          );
        }
      );
    }
  );
};

export const getEventById = (req: Request, res: Response) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM events WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }


      if (Array.isArray(results) && results.length > 0) {
        return res.json(results[0]);
      } else {
        return res.status(404).send("Event not found");
      }
    }
  );
};

export const getUserTicketsForEvent = (req: Request, res: Response) => {
  const { eventId, userId } = req.params;

  const query =
    "SELECT SUM(quantity) AS total_tickets FROM ticket_purchases WHERE event_id = ? AND user_id = ?";

  connection.query<RowDataPacket[]>(
    query,
    [eventId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (results.length > 0) {
        const totalTickets = results[0].total_tickets || 0;
        return res.json({ totalTickets });
      } else {
        return res.status(404).json({ message: "No tickets found" });
      }
    }
  );
};

export const getEventReviews = (req: Request, res: Response) => {
  const { id } = req.params; 

  connection.query<RowDataPacket[]>(
    "SELECT user_id, rating, review FROM reviews WHERE event_id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (results.length > 0) {
        return res.json(results);
      } else {
        return res.status(404).json({ message: "No reviews found" });
      }
    }
  );
};


export const addEventReview = (req: Request, res: Response) => {
  const { id } = req.params; 
  const { userId, rating, review } = req.body;

  const insertQuery =
    "INSERT INTO reviews (event_id, user_id, rating, review) VALUES (?, ?, ?, ?)";

  connection.query(
    insertQuery,
    [id, userId, rating, review],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to submit review", error: err });
      }

      return res.status(201).json({ message: "Review added successfully" });
    }
  );
};