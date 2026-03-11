import * as busRepository from '../repositories/busRepository.js';

export const getAllBuses = async () => {
  return await busRepository.findAllBuses();
};

export const createBus = async (number) => {
  if (!number || typeof number !== 'string' || number.trim() === '') {
    throw new Error('Bus number is required');
  }

  const existingBus = await busRepository.findBusByNumber(number);
  if (existingBus) {
    throw new Error('Bus already exists');
  }

  return await busRepository.createBus({ 
    number: number.toUpperCase().trim() 
  });
};

export const getBusById = async (id) => {
  const bus = await busRepository.findBusById(id);
  if (!bus) {
    throw new Error('Bus not found');
  }
  return bus;
};

export const removeBus = async (id) => {
  const bus = await busRepository.findBusById(id);
  if (!bus) {
    throw new Error('Bus not found');
  }
  
  await busRepository.deleteBusById(id);
  return { message: 'Bus deleted successfully' };
};
