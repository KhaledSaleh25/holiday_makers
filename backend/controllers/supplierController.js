const Supplier = require('../models/Supplier');
const { body, validationResult } = require('express-validator');
const exceljs = require('exceljs');

// @desc    Get all suppliers with search and filters
// @route   GET /api/suppliers
// @access  Private
exports.getSuppliers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      supplierType, 
      country, 
      branch 
    } = req.query;

    let query = {};

    // Search by supplier name, email, phone, or supplier code
    if (search) {
      query.$or = [
        { supplierName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } },
        { supplierCode: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by supplier type
    if (supplierType) query.supplierType = supplierType;
    
    // Filter by country
    if (country) query.country = { $regex: country, $options: 'i' };
    
    // Filter by branch
    if (branch) query.branch = { $regex: branch, $options: 'i' };

    const suppliers = await Supplier.find(query)
      .select('-__v')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Supplier.countDocuments(query);

    res.json({
      success: true,
      data: suppliers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSuppliers: total
      }
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching suppliers'
    });
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
// @access  Private
exports.getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier'
    });
  }
};

// @desc    Create new supplier
// @route   POST /api/suppliers
// @access  Private
exports.createSupplier = [
  // Validation
  body('supplierName').notEmpty().withMessage('Supplier name is required'),
  body('supplierType').isIn(['Hotel', 'Transportation', 'Air Transport', 'Visa', 'Sightseeing', 'Assistant', 'Flight', 'Other']).withMessage('Invalid supplier type'),
  body('telephone').notEmpty().withMessage('Telephone is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('branch').notEmpty().withMessage('Branch is required'),

  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          message: 'Validation failed',
          errors: errors.array() 
        });
      }

      const {
        supplierName,
        supplierType,
        telephone,
        email,
        fax,
        url,
        cardNumber,
        country,
        city,
        stateRegion,
        address1,
        address2,
        zipCode,
        branch,
        mc,
        currency,
        accountingCode,
        taxNumber,
        licenceNumber,
        ownerName,
        missions,
        supplierPaymentType,
        taxPowerName,
        ref,
        remarkForInvoice,
        bju,
        isCustomer,
        logo
      } = req.body;

      // Check if supplier already exists with same email or phone
      const existingSupplier = await Supplier.findOne({
        $or: [
          { email: email?.toLowerCase() },
          { telephone: telephone }
        ]
      });

      if (existingSupplier) {
        return res.status(400).json({
          success: false,
          message: 'Supplier with this email or telephone already exists'
        });
      }

      const supplier = await Supplier.create({
        supplierName,
        supplierType,
        telephone,
        email: email?.toLowerCase(),
        fax,
        url,
        cardNumber,
        country,
        city,
        stateRegion,
        address1,
        address2,
        zipCode,
        branch,
        mc,
        currency,
        accountingCode,
        taxNumber,
        licenceNumber,
        ownerName,
        missions,
        supplierPaymentType,
        taxPowerName,
        ref,
        remarkForInvoice,
        bju,
        isCustomer,
        logo,
        createdBy: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'Supplier created successfully',
        data: supplier
      });
    } catch (error) {
      console.error('Create supplier error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Supplier code already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while creating supplier'
      });
    }
  }
];

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: updatedSupplier
    });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating supplier'
    });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    await Supplier.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting supplier'
    });
  }
};

// @desc    Export suppliers to Excel
// @route   GET /api/suppliers/export/excel
// @access  Private
exports.exportToExcel = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Suppliers');

    // Add headers
    worksheet.columns = [
      { header: 'Supplier Code', key: 'supplierCode', width: 15 },
      { header: 'Supplier Name', key: 'supplierName', width: 30 },
      { header: 'Supplier Type', key: 'supplierType', width: 20 },
      { header: 'Telephone', key: 'telephone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Country', key: 'country', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'Branch', key: 'branch', width: 15 },
      { header: 'Currency', key: 'currency', width: 10 },
      { header: 'Tax Number', key: 'taxNumber', width: 15 },
      { header: 'Status', key: 'isActive', width: 10 }
    ];

    // Add data
    suppliers.forEach(supplier => {
      worksheet.addRow({
        supplierCode: supplier.supplierCode,
        supplierName: supplier.supplierName,
        supplierType: supplier.supplierType,
        telephone: supplier.telephone,
        email: supplier.email,
        country: supplier.country,
        city: supplier.city,
        branch: supplier.branch,
        currency: supplier.currency,
        taxNumber: supplier.taxNumber,
        isActive: supplier.isActive ? 'Active' : 'Inactive'
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=suppliers.xlsx');

    // Send the workbook
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Export suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting suppliers'
    });
  }
};

// @desc    Import suppliers from Excel
// @route   POST /api/suppliers/import/excel
// @access  Private
exports.importFromExcel = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.files.file;
    const workbook = new exceljs.Workbook();
    
    // Load the uploaded file
    await workbook.xlsx.load(file.data);
    const worksheet = workbook.getWorksheet(1);
    
    const importedSuppliers = [];
    const errors = [];

    // Start from row 2 (skip header)
    for (let i = 2; i <= worksheet.rowCount; i++) {
      try {
        const row = worksheet.getRow(i);
        const supplierData = {
          supplierName: row.getCell(2).value,
          supplierType: row.getCell(3).value,
          telephone: row.getCell(4).value,
          email: row.getCell(5).value,
          country: row.getCell(6).value,
          city: row.getCell(7).value,
          branch: row.getCell(8).value,
          currency: row.getCell(9).value,
          taxNumber: row.getCell(10).value,
          createdBy: req.user._id
        };

        // Validate required fields
        if (!supplierData.supplierName || !supplierData.telephone || !supplierData.country || !supplierData.city || !supplierData.branch) {
          errors.push(`Row ${i}: Missing required fields`);
          continue;
        }

        const supplier = await Supplier.create(supplierData);
        importedSuppliers.push(supplier);

      } catch (error) {
        errors.push(`Row ${i}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: `Imported ${importedSuppliers.length} suppliers successfully`,
      data: {
        imported: importedSuppliers.length,
        errors: errors
      }
    });

  } catch (error) {
    console.error('Import suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while importing suppliers'
    });
  }
};

// @desc    Get supplier statistics
// @route   GET /api/suppliers/stats/overview
// @access  Private
exports.getSupplierStats = async (req, res) => {
  try {
    const totalSuppliers = await Supplier.countDocuments();
    
    // Get suppliers by type
    const suppliersByType = await Supplier.aggregate([
      {
        $group: {
          _id: '$supplierType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get suppliers by country
    const suppliersByCountry = await Supplier.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalSuppliers,
        suppliersByType,
        suppliersByCountry
      }
    });
  } catch (error) {
    console.error('Get supplier stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching supplier statistics'
    });
  }
};