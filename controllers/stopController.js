import * as stopService from '../services/stopService.js';

export const listStops = async (req, res) => {
  try {
    const stops = await stopService.getAllStops();
    res.json({ success: true, data: stops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStop = async (req, res) => {
  try {
    const { name, description, lat, long } = req.body;
    const stop = await stopService.createStop({ name, description, lat, long });
    res.status(201).json({ success: true, data: stop });
  } catch (error) {
    const status = error.message.includes('required') ? 400 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};
