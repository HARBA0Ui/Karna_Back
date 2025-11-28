import User from '../models/User.js';

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id) => {
  return await User.findById(id).select('-pwd');
};

export const createUser = async (userData) => {
  return await User.create(userData);
};
