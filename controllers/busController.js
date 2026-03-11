import * as busService from '../services/busService.js';

export const getAllBuses = async (req, res) => {
  try {
    const buses = await busService.getAllBuses();
    res.json({ success: true, data: buses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBus = async (req, res) => {
  try {
    const { number } = req.body;
    const bus = await busService.createBus(number);
    res.status(201).json({ success: true, data: bus });
  } catch (error) {
    const statusCode = error.message.includes('required') || error.message.includes('already exists') 
      ? 400 
      : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const getBusById = async (req, res) => {
  try {
    const bus = await busService.getBusById(req.params.id);
    res.json({ success: true, data: bus });
  } catch (error) {
    const statusCode = error.message === 'Bus not found' ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const result = await busService.removeBus(req.params.id);
    res.json({ success: true, message: result.message });
  } catch (error) {
    const statusCode = error.message === 'Bus not found' ? 404 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};
