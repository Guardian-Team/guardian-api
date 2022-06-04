const { User } = require('../models');
const fse = require('fs-extra');

exports.getUserById = async function (req, res) {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    res.status(200).send({ message: 'Response Success', data: user });
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};

exports.updateUser = async function (req, res) {
  try {
    const { id } = req.params;
    const userExist = await User.findOne({ where: { id } });
    if (userExist) {
      const editedData = { ...req.body };
      const oldAvatar = userExist.avatar;
      if (req.files) {
        await fse.remove(`./images/${oldAvatar}`);
        const newAvatar = req.files.avatar;
        const newAvatarName = req.files.avatar.name;
        await newAvatar.mv(`./images/${newAvatarName}`);
        editedData.avatar = newAvatarName;
      }
      await User.update(editedData, { where: { id } });
      const newDetailUser = await User.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      res.status(200).json({
        message: `Data with id ${id} has been updated`,
        data: newDetailUser,
      });
    } else {
      res.status(400).send({ message: "Data isn't exist" });
    }
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};
