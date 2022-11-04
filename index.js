import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRoutes from "./routes/bookings.js";
import roomRoutes from "./routes/rooms.js";
import authRoutes from "./routes/auth.js";

const app = express();
dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '30mb' }));
app.use(cors());

//setting up routes
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);
//connecting to database
const DB = process.env.MONGO_URI;
mongoose
    .connect(DB)
    .then(() => {
        app.listen(process.env.PORT || 5000);
    })
    .then(() => {
        console.log('server connected to db');
    });
app.get('/', (req, res) => {
    res.send('Hotelghor server is connected');
});
