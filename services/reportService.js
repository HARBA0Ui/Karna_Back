import * as reportRepository from '../repositories/reportRepository.js';
import * as postRepository from '../repositories/postRepository.js';
import notificationService from './notificationService.js';

export const getAllReports = async () => {
  return await reportRepository.findAllReports();
};

// Matches controller: getReportDetail
export const getReportDetails = async (id) => {
  const report = await reportRepository.findReportById(id);
  if (!report) throw new Error('Signalement non trouvé');
  return report;
};

export const submitReport = async (userId, reportData) => {
  const post = await postRepository.findPostById(reportData.reportedPost);
  if (!post) throw new Error('Post signalé introuvable');

  return await reportRepository.createReport({
    ...reportData,
    reporter: userId
  });
};

export const validateReport = async (reportId) => {
  const report = await reportRepository.updateReportStatus(reportId, 'validé');
  if (!report) throw new Error('Signalement non trouvé');

  await notificationService.send(
    report.reporter._id,
    `Votre signalement a été validé.`,
    'report'
  );

  if (report.reportedPost) {
    const post = await postRepository.updatePostStatus(report.reportedPost, 'rejeté');
    await notificationService.send(
      post.author._id,
      `Votre proposition a été rejetée suite à un signalement.`,
      'post'
    );
  }
  return report;
};

export const rejectReport = async (reportId) => {
  const report = await reportRepository.updateReportStatus(reportId, 'rejeté');
  if (!report) throw new Error('Signalement non trouvé');

  await notificationService.send(
    report.reporter._id,
    `Votre signalement a été rejeté.`,
    'report'
  );
  return report;
};
