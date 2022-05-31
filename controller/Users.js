const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const util = require('util');
const connection = mysql.createConnection({
  host: '34.101.191.226',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'guardian-db',
});

connection.connect((err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Connected');
});

const query = util.promisify(connection.query).bind(connection);

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
    // console.log(result);
    if (!result.length)
      return res.status(400).json({ message: 'Failed login' });
    const match = await bcrypt.compare(password, result[0].password);
    if (!match) return res.status(400).json({ message: 'Failed login' });
    const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    return error.message;
  }
};
