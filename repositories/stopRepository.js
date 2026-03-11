import Stop from '../models/Stop.js';

export const findAllStops = async () => {
  return await Stop.find({}).sort({ name: 1 });
};

export const createStop = async (data) => {
  return await Stop.create(data);
};
