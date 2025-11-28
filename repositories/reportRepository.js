import Report from '../models/Report.js';

// Used by getAllReports
export const findAllReports = async () => {
  return await Report.find({})
    .populate('reporter', 'nickname email')
    .populate('reportedPost', 'title type status')
    .sort({ date: -1 });
};

// Used by getReportDetails
export const findReportById = async (id) => {
  return await Report.findById(id)
    .populate('reporter', 'nickname')
    .populate('reportedPost');
};

export const createReport = async (data) => {
  return await Report.create(data);
};

// Used by validateReport / rejectReport
export const updateReportStatus = async (id, status) => {
  return await Report.findByIdAndUpdate(id, { status }, { new: true }).populate('reporter');
};
