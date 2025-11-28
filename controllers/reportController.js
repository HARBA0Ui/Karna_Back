import * as reportService from "../services/reportService.js"

export const listReports = async (req, res) => {
  try {
    const reports = await reportService.getAllReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportDetail = async (req, res, next) => {
  try {
    const report = await reportService.getReportDetails(req.params.id);
    res.json(report);
  } catch (error) {
    next(error);
  }
};


export const createReport = async (req, res) => {
  try {
    const report = await reportService.submitReport(req.user.userId, req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validateReport = async (req, res) => {
  try {
    const report = await reportService.validateReport(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const rejectReport = async (req, res) => {
  try {
    const report = await reportService.rejectReport(req.params.id);
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
