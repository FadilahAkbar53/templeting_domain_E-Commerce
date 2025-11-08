// backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// REGISTER USER
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // cek user sudah ada atau belum
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User sudah ada' });
    }

    // buat user baru
    const user = await User.create({ username, password, role });

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah' });

    // buat token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// (Opsional) ambil semua user
const getUsers = async (req, res) => {
  const users = await User.find().select('-password'); // tidak tampilkan password
  res.json(users);
};

module.exports = { registerUser, loginUser, getUsers };
