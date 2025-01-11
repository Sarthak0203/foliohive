import Analytics from '../models/Analytics';

// Increment analytics data
export const incrementAnalytics = async (projectId, type) => {
  try {
    const update = { $inc: { [type]: 1 } };
    const analytics = await Analytics.findOneAndUpdate(
      { project: projectId },
      update,
      { upsert: true, new: true }
    );
    return analytics;
  } catch (err) {
    console.error('Error incrementing analytics:', err);
    throw err;
  }
};

// Fetch analytics data for a project
export const getAnalytics = async (projectId) => {
  try {
    const analytics = await Analytics.findOne({ project: projectId });
    return analytics || { views: 0, likes: 0, comments: 0, shares: 0 };
  } catch (err) {
    console.error('Error fetching analytics:', err);
    throw err;
  }
};

// Process analytics data for charts
export const processAnalyticsForCharts = (analytics) => {
  if (!analytics) return [];
  return [
    { label: 'Views', value: analytics.views },
    { label: 'Likes', value: analytics.likes },
    { label: 'Comments', value: analytics.comments },
    { label: 'Shares', value: analytics.shares },
  ];
};
