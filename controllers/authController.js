const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const VALID_ROLES = ['VIEWER', 'ANALYST', 'ADMIN'];
const JWT_SECRET = (process.env.JWT_SECRET && process.env.JWT_SECRET.trim())
    ? process.env.JWT_SECRET
    : 'finance_dev_secret_change_me';

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const normalizedRole = role ? String(role).toUpperCase() : undefined;

        const newUserData = {
            name,
            email,
            password: hashedPassword
        };

        if (normalizedRole) {
            newUserData.role = normalizedRole;
        }

        const newUser = await User.create(newUserData);

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'User is inactive' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('_id name email role isActive');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { role, isActive } = req.body;

        if (role === undefined && isActive === undefined) {
            return res.status(400).json({ message: 'role or isActive is required' });
        }

        const updates = {};

        if (role !== undefined) {
            const normalizedRole = String(role).toUpperCase();
            if (!VALID_ROLES.includes(normalizedRole)) {
                return res.status(400).json({ message: 'Invalid role value' });
            }
            updates.role = normalizedRole;
        }

        if (isActive !== undefined) {
            if (typeof isActive !== 'boolean') {
                return res.status(400).json({ message: 'isActive must be boolean' });
            }
            updates.isActive = isActive;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).select('_id name email role isActive');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
