const Reservation = require('../models/Reservation');
const Customer = require('../models/customers');

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
  try {
    // Get real stats from database
    const totalCustomers = await Customer.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    
    const dashboardData = {
      user: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      stats: {
        totalBookings: totalReservations,
        pendingReservations: pendingReservations,
        totalCustomers: totalCustomers,
        revenue: 0 // You'll implement this
      },
      menu: {
        // Your menu structure here
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
};