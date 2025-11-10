// backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// REGISTER USER
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    console.log(`📝 Registration attempt for user: ${username} with role: ${role || 'user'}`);
    
    // cek user sudah ada atau belum
    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log(`❌ Registration failed: User '${username}' already exists`);
      return res.status(400).json({ message: 'User sudah ada' });
    }

    // buat user baru
    const user = await User.create({ username, password, role });

    console.log(`✅ Registration successful: User '${username}' created with role '${user.role}'`);

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(`❌ Registration error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`🔐 Login attempt for user: ${username}`);
    
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`❌ Login failed: User '${username}' not found`);
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`❌ Login failed: Invalid password for user '${username}'`);
      return res.status(401).json({ message: 'Password salah' });
    }

    // buat token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`✅ Login successful: User '${username}' (${user.role})`);

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
    console.error(`❌ Login error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

// (Opsional) ambil semua user
const getUsers = async (req, res) => {
  const users = await User.find().select('-password'); // tidak tampilkan password
  res.json(users);
};

module.exports = { registerUser, loginUser, getUsers };
