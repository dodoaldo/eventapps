"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mysql2_1 = __importDefault(require("mysql2"));
const app = (0, express_1.default)();
const PORT = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const connection = mysql2_1.default.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dodoaldo2',
    database: 'event_db',
});
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL.');
});
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/events', (req, res) => {
    connection.query('SELECT * FROM events', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});
app.post('/events', (req, res) => {
    const { name, date, location, category, available_seats } = req.body;
    const query = 'INSERT INTO events (name, date, location, category, available_seats) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, date, location, category, available_seats], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        const insertId = results.insertId;
        res.status(201).json({ id: insertId, name, date, location, category, available_seats });
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
