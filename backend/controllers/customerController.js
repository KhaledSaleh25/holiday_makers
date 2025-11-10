const Customer = require('../models/customers');

// @desc    Get all customers with search and filters
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      customerType, 
      country, 
      branch 
    } = req.query;

    let query = {};

    // Search by customer name, email, phone, or customer code
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } },
        { customerCode: { $regex: search, $options: 'i' } },
        { nationalId: { $regex: search, $options: 'i' } },
        { passportNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by customer type
    if (customerType) query.customerType = customerType;
    
    // Filter by country
    if (country) query.country = { $regex: country, $options: 'i' };
    
    // Filter by branch
    if (branch) query.branch = { $regex: branch, $options: 'i' };

    const customers = await Customer.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Customer.countDocuments(query);

    res.json({
      success: true,
      data: customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCustomers: total
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customers'
    });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer'
    });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res) => {
  try {
    const {
      customerName,
      customerType,
      telephone,
      additionalPhone,
      email,
      fax,
      url,
      country,
      city,
      regionCity,
      buildingNumber,
      address1,
      address2,
      zipCode,
      nationalId,
      passportNumber,
      taxNumber,
      licenceNumber,
      branch,
      creditTerm,
      accountingCode,
      galliceCode,
      amdOfficeIds,
      costPlus,
      customerCommission,
      refNote,
      ownerName,
      staffOwner,
      accountManager,
      title,
      nationality,
      remarkForInvoice,
      ledger
    } = req.body;

    // Check if customer already exists with same email or phone
    const existingCustomer = await Customer.findOne({
      $or: [
        { email: email?.toLowerCase() },
        { telephone: telephone }
      ]
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this email or telephone already exists'
      });
    }

    const customer = await Customer.create({
      customerName,
      customerType,
      telephone,
      additionalPhone,
      email: email?.toLowerCase(),
      fax,
      url,
      country,
      city,
      regionCity,
      buildingNumber,
      address1,
      address2,
      zipCode,
      nationalId,
      passportNumber,
      taxNumber,
      licenceNumber,
      branch,
      creditTerm,
      accountingCode,
      galliceCode,
      amdOfficeIds,
      costPlus,
      customerCommission,
      refNote,
      ownerName,
      staffOwner,
      accountManager,
      title,
      nationality,
      remarkForInvoice,
      ledger,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer code already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating customer'
    });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: updatedCustomer
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating customer'
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting customer'
    });
  }
};

// @desc    Get customer statistics
// @route   GET /api/customers/stats/overview
// @access  Private
exports.getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const individualCustomers = await Customer.countDocuments({ customerType: 'Individual' });
    const corporateCustomers = await Customer.countDocuments({ customerType: 'Corporate' });
    
    // Get customers by country
    const customersByCountry = await Customer.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get customers by branch
    const customersByBranch = await Customer.aggregate([
      {
        $group: {
          _id: '$branch',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        individualCustomers,
        corporateCustomers,
        customersByCountry,
        customersByBranch
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer statistics'
    });
  }
};

// @desc    Search customers with advanced filters
// @route   GET /api/customers/search/advanced
// @access  Private
exports.advancedSearch = async (req, res) => {
  try {
    const {
      customerName,
      customerType,
      country,
      city,
      branch,
      email,
      telephone,
      nationalId,
      passportNumber,
      dateFrom,
      dateTo
    } = req.query;

    let query = {};

    if (customerName) query.customerName = { $regex: customerName, $options: 'i' };
    if (customerType) query.customerType = customerType;
    if (country) query.country = { $regex: country, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (branch) query.branch = { $regex: branch, $options: 'i' };
    if (email) query.email = { $regex: email, $options: 'i' };
    if (telephone) query.telephone = { $regex: telephone, $options: 'i' };
    if (nationalId) query.nationalId = { $regex: nationalId, $options: 'i' };
    if (passportNumber) query.passportNumber = { $regex: passportNumber, $options: 'i' };

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const customers = await Customer.find(query)
      .select('customerName customerType telephone email country city branch customerCode nationalId passportNumber createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while performing advanced search'
    });
  }
};