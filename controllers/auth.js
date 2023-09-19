const { Users, signUp, updateSubscriptionSchema } = require('../schema/users');
const HttpErr = require('../helpers/HttpErr');
const ctrlWrapper = require('../decorators/ctrl');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUpFn = async (req, res) => {
  const { error } = signUp.validate(req.body);

  if (error)
    throw HttpErr(400, 'Помилка від Joi або іншої бібліотеки валідації');

  const { password, email } = req.body;
  const user = await Users.findOne({ email });
  if (user) throw HttpErr(409, 'Email in use');

  const hash = await bcrypt.hash(password, 10);
  const newUser = await Users.create({ ...req.body, password: hash });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signIn = async (req, res) => {
  const { error } = signUp.validate(req.body);

  if (error) {
    throw HttpErr(400);
  }

  const { email, password } = req.body;
  const user = await Users.findOne({ email });

  if (!user) {
    throw HttpErr(401, 'Email or password is wrong');
  }
  const compareHashPassword = await bcrypt.compare(password, user.password);
  if (!compareHashPassword) {
    throw HttpErr(401, 'Email or password is wrong');
  }

  const payload = {
    id: user._id,
  };
  const { JWT_SECRET } = process.env;
  console.log(JWT_SECRET); //! не видит почему-то env если объявить выше

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  console.log(token);
  await Users.findByIdAndUpdate(user._id, { token }, { new: true });

  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const signOut = async (req, res) => {
  const { _id: contactId } = req.user;

  await Users.findByIdAndUpdate(contactId, { token: null }, { new: true });

  res.status(204).json({
    message: 'Logout success',
  });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpErr(400, 'missing field favorite');
  }

  const { error } = updateSubscriptionSchema.validate(req.body);

  if (error) {
    throw HttpErr(400, error.message);
  }

  const { _id: userId } = req.user;

  const user = await Users.findByIdAndUpdate(userId, req.body, { new: true });

  res.status(200).json({
    message: `Subscription updated on ${user.subscription} successfully`,
  });
};

module.exports = {
  signUpFn: ctrlWrapper(signUpFn),
  signIn: ctrlWrapper(signIn),
  signOut: ctrlWrapper(signOut),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  updateSubscription: ctrlWrapper(updateSubscription),
};
