const jwt = require('jsonwebtoken');

exports.authenticated = (req, res, next) => {
  let header, token;
  if (
    !(header = req.header('Authorization')) ||
    !(token = header.replace('Bearer ', ''))
  )
    return res.status(400).send({
      error: {
        message: 'Access Denied',
      },
    });
  try {
    const verified = jwt.verify(token, process.env.JWT_PASS);
    if (verified) {
      next();
    }
  } catch (err) {
    res.status(400).send({
      error: {
        message: 'Invalid token',
      },
    });
  }
};
