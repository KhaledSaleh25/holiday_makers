const express = require('express');
const { protect } = require('../middleware/auth');
const Reservation = require('../models/Reservation');
const Customer = require('../models/customers');

const router = express.Router();

// @desc    Get dashboard data and menu structure
// @route   GET /api/dashboard
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get real stats from database
    const totalCustomers = await Customer.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    
    // Calculate total revenue (you might want to implement this properly)
    const revenueResult = await Reservation.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

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
        revenue: totalRevenue
      },
      menu: {
        web: [
          { id: 'home', name: 'Home', icon: '🏠', path: '/home' },
          { id: 'reservations', name: 'Reservations', icon: '📅', path: '/reservations' },
          { id: 'customers', name: 'Customers', icon: '👥', path: '/customers' },
          { id: 'suppliers', name: 'Suppliers', icon: '🏢', path: '/suppliers' },
          { id: 'accounting', name: 'Accounting', icon: '💰', path: '/accounting' },
          { id: 'management', name: 'Management', icon: '⚙️', path: '/management' },
          { id: 'contracts', name: 'Contracts', icon: '📝', path: '/contracts' },
          { id: 'all-booking', name: 'All Booking', icon: '📖', path: '/all-booking' },
          { id: 'isra-compare', name: 'Isra Compare', icon: '🔍', path: '/isra-compare' },
          { id: 'visas', name: 'Visas', icon: '🛂', path: '/visas' },
          { id: 'transportation', name: 'Transportation', icon: '🚗', path: '/transportation' },
          { id: 'balloon', name: 'Balloon', icon: '🎈', path: '/balloon' },
          { id: 'bag-prices', name: 'Bag Prices', icon: '🎒', path: '/bag-prices' },
          { id: 'bags', name: 'Bags', icon: '💼', path: '/bags' },
          { id: 'airport-transfer', name: 'Airport Transfer', icon: '✈️', path: '/airport-transfer' },
          { id: 'charter-flight', name: 'Charter Flight', icon: '🛩️', path: '/charter-flight' },
          { id: 'flights', name: 'Flights', icon: '🛫', path: '/flights' }
        ],
        reservations: [
          { id: 'accounting-res', name: 'Accounting', icon: '💰', path: '/reservations/accounting' },
          { id: 'transportation-res', name: 'Transportation', icon: '🚗', path: '/reservations/transportation' },
          { id: 'visa-res', name: 'Visa', icon: '🛂', path: '/reservations/visa' }
        ],
        reports: [
          { id: 'flight-report', name: 'Flight Report', icon: '📊', path: '/reports/flight' },
          { id: 'haji-umrah', name: 'Haji & Umrah', icon: '🕋', path: '/reports/haji-umrah' },
          { id: 'other-report', name: 'Other Report', icon: '📈', path: '/reports/other' },
          { 
            id: 'bookings-reports', 
            name: 'Bookings reports', 
            icon: '📑', 
            path: '/reports/bookings',
            submenu: [
              { id: 'accommodation', name: 'Accommodation', path: '/reports/bookings/accommodation' },
              { id: 'visa', name: 'Visa', path: '/reports/bookings/visa' },
              { id: 'flight', name: 'Flight', path: '/reports/bookings/flight' },
              { id: 'guide', name: 'Guide', path: '/reports/bookings/guide' },
              { id: 'restaurant', name: 'Restaurant', path: '/reports/bookings/restaurant' },
              { id: 'sightseeing', name: 'Sightseeing', path: '/reports/bookings/sightseeing' },
              { id: 'transportation', name: 'Transportation', path: '/reports/bookings/transportation' },
              { id: 'package', name: 'Package', path: '/reports/bookings/package' },
              { id: 'tour', name: 'Tour', path: '/reports/bookings/tour' },
              { id: 'seat', name: 'Seat', path: '/reports/bookings/seat' }
            ]
          }
        ]
      },
      recentActivities: [
        { id: 1, activity: 'New booking received from Ahmed Mohamed', time: '2 hours ago', type: 'booking' },
        { id: 2, activity: 'Flight reservation confirmed for Cairo to Istanbul', time: '4 hours ago', type: 'flight' },
        { id: 3, activity: 'Visa application approved for group of 15', time: '1 day ago', type: 'visa' }
      ]
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
});

module.exports = router;