const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async function (req, res) {
  try {
    const { username, password, phone } = req.body;
    if (!username.length || !password.length || !phone.length)
      return res
        .status(400)
        .json({ message: 'Username, password, and phone must be filled' });
    const checkUsername = await User.findOne({
      where: {
        username,
      },
    });
    if (checkUsername) {
      return res.status(400).send({
        error: {
          message: 'Username already exist',
        },
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const dataUser = await User.create({
      username,
      password: hash,
      phone,
      avatar: null,
    });

    const token = jwt.sign({ id: dataUser.id }, process.env.JWT_PASS, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Account created',
      data: {
        id: dataUser.id,
        username: dataUser.username,
        password: dataUser.password,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};

exports.login = async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username.length || !password.length)
      return res
        .status(400)
        .json({ message: 'Username and password must be filled' });
    const userExist = await User.findOne({
      where: {
        username,
      },
    });
    if (!userExist) {
      return res.status(400).send({
        error: {
          message: "Couldn't find your account",
        },
      });
    }

    const matchPass = await bcrypt.compare(password, userExist.password);
    if (!matchPass) {
      return res.status(400).send({
        error: {
          message: 'Email or password invalid',
        },
      });
    }
    const token = jwt.sign({ id: userExist.id }, process.env.JWT_PASS, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Success Login',
      data: {
        id: userExist.id,
        username: userExist.username,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};
