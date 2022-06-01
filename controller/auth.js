const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const query = require('../db/connection');

exports.register = async function (req, res) {
  try {
    const { username, password, phone } = req.body;
    if (!username.length || !password.length || !phone.length)
      return res
        .status(400)
        .json({ message: 'Username, password, and phone must be filled' });
    const result = await query(
      `SELECT * FROM user WHERE username = '${username}'`
    );
    if (result.length)
      return res.status(400).json({ message: 'Username already exist' });
    const hash = await bcrypt.hash(password, 10);
    await query(
      `INSERT INTO user (username, password, phone) VALUES ('${username}', '${hash}', '${phone}')`
    );
    res.status(200).json({
      message: 'Account created',
      data: { username, password: hash },
    });
  } catch (error) {
    return error.message;
  }
};

exports.login = async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username.length || !password.length)
      return res
        .status(400)
        .json({ message: 'Username and password must be filled' });
    const result = await query(
      `SELECT * FROM user WHERE username = '${username}'`
    );
    if (!result.length)
      return res.status(400).json({ message: 'Failed login' });
    const match = await bcrypt.compare(password, result[0].password);
    if (!match) return res.status(400).json({ message: 'Failed login' });
    const token = jwt.sign({ username }, process.env.JWT_PASS, { expiresIn: '1h' });
    res
      .status(200)
      .json({
        message: 'Success Login',
        data: { userId: result[0].id, token },
      });
  } catch (error) {
    return error.message;
  }
};
