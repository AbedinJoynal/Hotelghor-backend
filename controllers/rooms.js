import Rooms from '../models/rooms.js';

export const getRooms = async (req, res) => {
    try {
        const rooms = await Rooms.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getRoom = async (req, res) => {
    const { id } = req.params;
    const url = id;
    try {
        const room = await Rooms.findOne({ url });
        res.status(200).json(room);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
