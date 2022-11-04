import express from 'express';
import { getRooms, getRoom } from '../controllers/rooms.js';
const router = express.Router();

router.get('/', getRooms);
router.post('/:id', getRoom);

export default router;
