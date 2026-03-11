import Bus from '../models/Bus.js';

export const findAllBuses = async () => {
  return await Bus.find({}).sort({ number: 1 });
};

export const findBusByNumber = async (number) => {
  return await Bus.findOne({ number: number.toUpperCase() });
};

export const createBus = async (busData) => {
  return await Bus.create(busData);
};

export const findBusById = async (id) => {
  return await Bus.findById(id);
};

export const deleteBusById = async (id) => {
  return await Bus.findByIdAndDelete(id);
};
