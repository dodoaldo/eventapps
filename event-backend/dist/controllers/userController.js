"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mysql2_1 = __importDefault(require("mysql2"));
const connection = mysql2_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "Dodoaldo2",
    database: "event_db",
});
const registerUser = (req, res) => {
    const { username, password, role } = req.body;
    const saltRounds = 10;
    bcrypt_1.default.hash(password, saltRounds, (err, hashedPassword) => {
        if (err)
            return res.status(500).send(err);
        const query = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
        connection.query(query, [username, hashedPassword, role], (err, results) => {
            if (err)
                return res.status(500).send(err);
            const userId = results.insertId;
            res.status(201).json({ id: userId, username, role });
        });
    });
};
exports.registerUser = registerUser;
const loginUser = (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err)
            return res.status(500).send(err);
        if (results.length === 0)
            return res.status(401).send('User not found');
        const user = results[0];
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            return res.status(401).send('Invalid password');
        }
        res.json({ id: user.id, username: user.username, role: user.role });
    });
};
exports.loginUser = loginUser;
