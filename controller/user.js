const { User } = require('../models');
const bcrypt = require('bcrypt');
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const joi = require('joi');
// Instantiate a storage client with credentials
const storage = new Storage({
  keyFilename: process.env.keyFilename,
  projectId: process.env.PROJECT_ID,
});
const bucket = storage.bucket(process.env.BUCKET_NAME);

exports.getUserById = async function (req, res) {
  try {
    const { id } = req.params;
    const userExist = await User.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    if (!userExist) {
      return res.status(400).send({
        error: {
          message: "Couldn't find your account",
        },
      });
    }
    res.status(200).send({ message: 'Response Success', data: userExist });
  } catch (error) {
    res.status(500).send({
      error: {
        message: error.message,
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
      const schema = joi.object({
        name: joi.string().min(3),
        password: joi.string().min(8),
        phone: joi.string(),
      });
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).send({
          error: {
            message: error.details[0].message,
          },
        });
      }
      if (req.file) {
        if (oldAvatar) {
          try {
            const fileName = oldAvatar.split('/')[4];
            await bucket.file(fileName).delete();
          } catch (error) {
            return res.status(400).json({ message: error.message });
          }
        }
        const imageUrl = await new Promise((resolve, reject) => {
          const { originalname, buffer } = req.file;
          const [imageName, fileType] = originalname.split('.');
          const timestamp = Date.now();

          const blob = bucket.file(
            `${imageName.replace(/ /g, '-')}_${timestamp}.${fileType}`
          );
          const blobStream = blob.createWriteStream({
            resumable: false,
          });
          blobStream
            .on('finish', () => {
              const publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
              );
              resolve(publicUrl);
            })
            .on('error', () => {
              reject(`Unable to upload image, something went wrong`);
            })
            .end(buffer);
        });
        editedData.avatar = imageUrl;
      }
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 10);
        editedData.password = hash;
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
        message: error.message,
      },
    });
  }
};
