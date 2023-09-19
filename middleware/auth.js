const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { HttpErr } = require('../helpers/HttpErr');

const User = require('../schema/users');

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    next(HttpErr(401, 'Not authorized'));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (!user || !user.token) {
      next(HttpErr(401, 'Not authorized'));
    }

    req.user = user;

    next();
  } catch {
    next(HttpErr(401, 'Not authorized'));
  }
};

module.exports = authenticate;
