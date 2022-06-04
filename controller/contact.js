const { User, Contact } = require('../models');

exports.getContactsByUserId = async function (req, res) {
  try {
    const { userId } = req.params;
    const result = await Contact.findAll({
      where: {
        userId,
      },
      include: {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
      },
    });
    return res.status(200).json({ message: 'Success Request', data: result });
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};

exports.addContact = async function (req, res) {
  try {
    const { name, phone } = req.body;
    const { userId } = req.params;
    const userExist = await User.findOne({ where: { id: userId } });
    if (!userExist)
      return res.status(400).json({
        message: `Failed to add contact. User with id ${userId} doesn't exist`,
      });
    const dataContact = await Contact.create({ name, phone, userId });
    res.status(200).json({
      message: 'Success added contact',
      data: { name: dataContact.name, phone: dataContact.phone },
    });
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};

exports.updateContact = async function (req, res) {
  try {
    const { userId, contactId } = req.params;
    const detailContact = await Contact.findOne({
      where: { userId, id: contactId },
    });
    if (detailContact) {
      const editedData = { ...req.body };
      await Contact.update({ editedData, where: { id: contactId } });
      const newDetailContact = await Contact.findOne({
        where: { userId, id: contactId },
        include: {
          model: User,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'userId', 'UserId'],
        },
      });
      res.status(200).json({
        message: `Contact has been updated`,
        data: newDetailContact,
      });
    } else {
      res.status(400).send({ message: "Contact isn't exist" });
    }
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};

exports.deleteContact = async function (req, res) {
  try {
    const { userId, contactId } = req.params;
    const detailContact = await Contact.findOne({
      where: { userId, id: contactId },
    });
    if (detailContact) {
      await Contact.destroy({ where: { id: contactId } });
      res.status(200).json({
        message: `Contact with id ${detailContact.id} has been deleted`,
      });
    } else {
      res.status(400).send({ message: "Contact isn't exist" });
    }
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};
