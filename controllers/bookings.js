import Bookings from '../models/bookings.js';
import Rooms from '../models/rooms.js';
import { generateID, deleteExpiredBookings } from './helper.js';

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await deleteExpiredBookings();
        return res.status(200).json(bookings);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const getBooking = async (req, res) => {
    try {
        deleteExpiredBookings();
        let existingBooking;
        const { confirmation, email } = req.body;

        if (confirmation.length > 0) {
            existingBooking = await Bookings.find({
                confirmation: confirmation.toUpperCase(),
            });
        } else if (email.length > 0) {
            existingBooking = await Bookings.find({ email: email });
        } else {
            return res.status(404).json({ message: error.message });
        }

        if (existingBooking) {
            return res.status(200).json(existingBooking);
        } else {
            return res.status(404).json({ message: error.message });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const postBooking = async (req, res) => {
    try {
        const data = req.body;
        const {
            firstName,
            lastName,
            email,
            phone,
            adults,
            children,
            dates,
            title,
            totalPrice,
            paymentType,
            cardNum,
        } = data;
        // create a unique booking ID
        let newId = generateID(6);

        const idArr = [];
        const allUsers = await Bookings.find();
        allUsers.forEach((info) => {
            idArr.push(info.comfirmation);
        });
        while (idArr.includes(newId)) {
            newId = generateID(6);
        }

        const result = await Bookings.create({
            firstName,
            lastName,
            email,
            phone,
            adults,
            children,
            startDate: dates[0],
            endDate: dates[1],
            room: title,
            price: totalPrice,
            cardType: paymentType,
            cardNum,
            confirmation: newId,
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteBooking = async (req, res) => {
    const { id } = req.body;

    try {
        const result = await Bookings.findOneAndDelete({ confirmation: id });
        res.status(200).json({ result: result });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getAllAvailable = async (req, res) => {
    const data = req.body;

    try {
        const roomData = await Rooms.find({
            $and: [
                { adults: { $gte: data.adults } },
                { children: { $gte: data.children } },
            ],
        });
        let available = roomData.map((element) => ({
            ...element.toObject(),
        }));

        let roomTitles = [];
        for (let room of available) {
            roomTitles.push(room.title);
        }

        const existingBookings = await Bookings.find({
            room: { $in: [...roomTitles] },
        });

        const startDate = new Date(data.dates[0]);
        const endDate = new Date(data.dates[1]);

        for (let booking of existingBookings) {
            let existingStartDate = new Date(booking.startDate).getTime();
            let existingEndDate = new Date(booking.endDate).getTime();
            // check for date collision
            if (
                (existingStartDate >= startDate.getTime() &&
                    existingStartDate <= endDate.getTime()) ||
                (existingEndDate >= startDate.getTime() &&
                    existingEndDate <= endDate.getTime())
            ) {
                for (let room of available) {
                    if (room.title === booking.room) {
                        room.hasError = {
                            room: booking.room,
                            dates: [booking.startDate, booking.endDate],
                        };
                    }
                }
            }
        }

        res.status(200).json(available);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
