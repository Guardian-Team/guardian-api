const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const { User } = require('../models');

exports.register = async function (req, res) {
  try {
    const { name, email, password, phone } = req.body;
    const schema = joi.object({
      name: joi.string().min(3).required(),
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
      phone: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }
    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return res.status(400).send({
        error: {
          message: 'Email already exist',
        },
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const dataUser = await User.create({
      name,
      email,
      password: hash,
      phone,
      avatar: null,
    });

    const token = jwt.sign({ id: dataUser.id }, process.env.JWT_PASS, {
      expiresIn: '2d',
    });

    res.status(200).json({
      message: 'Account created',
      data: {
        id: dataUser.id,
        name: dataUser.name,
        email: dataUser.email,
        password: dataUser.password,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      error: {
        message: error.message,
      },
    });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }
    const userExist = await User.findOne({
      where: {
        email,
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
    const token = jwt.sign({ id: userExist.id }, process.env.JWT_PASS, {
      expiresIn: '2d',
    });

    res.status(200).json({
      message: 'Success Login',
      data: {
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).send({
      error: {
        message: error.message,
      },
    });
  }
};
