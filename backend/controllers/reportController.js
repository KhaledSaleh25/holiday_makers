const Reservation = require('../models/Reservation');
const Invoice = require('../models/Invoice');

// @desc    Get reservation statistics
// @route   GET /api/reports/statistics
// @access  Private
exports.getStatistics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query; // daily, monthly, yearly

    // Get date ranges based on period
    const getDateRange = () => {
      const now = new Date();
      switch (period) {
        case 'daily':
          return {
            start: new Date(now.setHours(0, 0, 0, 0)),
            end: new Date(now.setHours(23, 59, 59, 999))
          };
        case 'monthly':
          return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
          };
        case 'yearly':
          return {
            start: new Date(now.getFullYear(), 0, 1),
            end: new Date(now.getFullYear(), 11, 31)
          };
        default:
          return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
          };
      }
    };

    const { start, end } = getDateRange();

    // Get statistics by reservation type
    const stats = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format statistics
    const statistics = {
      flights: { amount: 0, count: 0 },
      hotels: { amount: 0, count: 0 },
      transportation: { amount: 0, count: 0 },
      visa: { amount: 0, count: 0 },
      tour: { amount: 0, count: 0 },
      package: { amount: 0, count: 0 }
    };

    stats.forEach(stat => {
      if (statistics[stat._id]) {
        statistics[stat._id] = {
          amount: stat.totalAmount,
          count: stat.count
        };
      }
    });

    // Add demo data (you can remove this later)
    if (period === 'yearly') {
      statistics.flights = { amount: 6000, count: 12 };
      statistics.hotels = { amount: 43750, count: 25 };
      statistics.transportation = { amount: 26500, count: 18 };
      statistics.visa = { amount: 3000, count: 8 };
    } else if (period === 'monthly') {
      statistics.flights = { amount: 42350, count: 8 };
      statistics.hotels = { amount: 42350, count: 15 };
      statistics.transportation = { amount: 26500, count: 12 };
      statistics.visa = { amount: 3000, count: 5 };
    } else {
      statistics.flights = { amount: 40000, count: 6 };
      statistics.hotels = { amount: 42350, count: 10 };
      statistics.transportation = { amount: 26500, count: 8 };
      statistics.visa = { amount: 3000, count: 3 };
    }

    res.json({
      success: true,
      data: {
        period,
        dateRange: { start, end },
        statistics
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
};

// @desc    Get reservation reports
// @route   GET /api/reports/reservations
// @access  Private
exports.getReservationReports = async (req, res) => {
  try {
    const { 
      type, 
      startDate, 
      endDate,
      groupBy = 'type' // type, status, month
    } = req.query;

    let matchQuery = {};

    if (type) matchQuery.type = type;
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    let groupQuery = {};
    switch (groupBy) {
      case 'type':
        groupQuery = { _id: '$type' };
        break;
      case 'status':
        groupQuery = { _id: '$status' };
        break;
      case 'month':
        groupQuery = { 
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          }
        };
        break;
    }

    const reports = await Reservation.aggregate([
      { $match: matchQuery },
      {
        $group: {
          ...groupQuery,
          totalAmount: { $sum: '$amount' },
          totalReservations: { $sum: 1 },
          averageAmount: { $avg: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    res.json({
      success: true,
      data: reports,
      total: reports.length
    });
  } catch (error) {
    console.error('Get reservation reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reservation reports'
    });
  }
};