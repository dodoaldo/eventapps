import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2';

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dodoaldo2",
  database: "event_db",
});

export const registerUser = (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).send(err);

    const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    connection.query<ResultSetHeader>(query, [username, hashedPassword, role], (err, results) => {
      if (err) return res.status(500).send(err);

      const userId = results.insertId;
      res.status(201).json({ id: userId, username, role });
    });
  });
};

export const loginUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  connection.query<RowDataPacket[]>(query, [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('User not found');

    const user = results[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Invalid password');
    }

    res.json({ id: user.id, username: user.username, role: user.role });
  });
};
