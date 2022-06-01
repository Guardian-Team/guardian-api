const query = require('../db/connection');

exports.getUserById = async function (req, res) {
  try {
    const { id } = req.params;
    const result = await query(`SELECT * FROM user WHERE id = '${id}'`);
    return res
      .status(200)
      .json({ message: 'Success Request', data: result[0] });
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
    const data = req.body;
    const includedId = Object.keys(data).includes('id');
    if (includedId) return res.status(400).json({ message: 'Invalid Request' });

    const dataUpdated = Object.entries(data)
      .map((item) => `${item[0]} = '${item[1]}'`)
      .join(', ');
    await query(`UPDATE user SET ${dataUpdated} WHERE id = '${id}'`);
    const result = await query(`SELECT * FROM user WHERE id = '${id}'`);
    return res
      .status(200)
      .json({ message: 'Success Request', data: result[0] });
  } catch (error) {
    res.status(500).send({
      error: {
        message: 'Server Error',
      },
    });
  }
};
