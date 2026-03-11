import * as reportService from "../services/reportService.js";

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
    const report = await reportService.getReportById(req.params.id);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

//  FIXED: Changed submitReport to createReport
export const createReport = async (req, res) => {
  try {
    console.log('Creating report:', req.body);
    console.log('User ID:', req.user.userId);
    
    const report = await reportService.createReport(req.user.userId, req.body);
    
    console.log('Report created successfully:', report);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(400).json({ error: error.message });
  }
};

export const validateReport = async (req, res) => {
  try {
    const report = await reportService.updateReportStatus(req.params.id, 'validé');
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const rejectReport = async (req, res) => {
  try {
    const report = await reportService.updateReportStatus(req.params.id, 'rejeté');
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
