import Auth from '../models/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export const signin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await Auth.findOne({ username });
        email;

        if (!existingUser)
            return res.status(404).json({ message: 'User does not exist.' });

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect)
            return res.status(400).json({ message: 'Invalid credentials.' });

        const token = jwt.sign(
            { username: existingUser.username, id: existingUser._id },
            'test',
            { expiresIn: '1h' }
        );

        res.status(200).json({ result: existingUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
};
