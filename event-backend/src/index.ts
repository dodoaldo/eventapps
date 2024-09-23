import express from "express";
import cors from "cors";
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import mysql from "mysql2";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dodoaldo2",
  database: "event_db",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL.");
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use('/api/users', userRoutes); 
app.use('/api/events', eventRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

