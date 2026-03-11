import * as reportRepository from '../repositories/reportRepository.js';
import * as notificationService from '../services/notificationService.js';
import { createReportStateMachine } from './workflows/statusWorkflow.js';

export const getAllReports = async () => {
  return await reportRepository.findAllReports();
};

export const getReportById = async (id) => {
  const report = await reportRepository.findReportById(id);
  if (!report) throw new Error('Report non trouvé');
  return report;
};

export const createReport = async (userId, reportData) => {
  return await reportRepository.createReport({
    ...reportData,
    reporter: userId,
    status: 'en attente'
  });
};

export const updateReportStatus = async (reportId, newStatus) => {
  const report = await reportRepository.findReportById(reportId);
  if (!report) throw new Error('Report non trouvé');

  const currentState = report.status || 'en attente';

  const stateMachine = createReportStateMachine(report, reportRepository);
  
  if (currentState === 'en attente') {
    if (newStatus === 'validé') {
      stateMachine.handle('APPROVE');
    } else if (newStatus === 'rejeté') {
      stateMachine.handle('REJECT');
    } else {
      throw new Error(`Invalid status: ${newStatus}. Must be 'validé' or 'rejeté'`);
    }
  } else {
    throw new Error(`Cannot transition from ${currentState} to ${newStatus}. Report already processed.`);
  }

  return await reportRepository.findReportById(reportId);
};

export const deleteReport = async (reportId) => {
  const report = await reportRepository.findReportById(reportId);
  if (!report) throw new Error('Report non trouvé');

  await reportRepository.deleteReportById(reportId);
  return { message: 'Report supprimé' };
};