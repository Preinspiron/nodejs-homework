const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { subscriptions } = require('../constants/constants');

const schema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

const Users = model('users', schema);

const signUp = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptions)
    .required(),
});

module.exports = { Users, signUp, updateSubscriptionSchema };
