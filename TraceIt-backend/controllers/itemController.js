const Item = require('../models/Item');

// @desc    Report a lost item
// @route   POST /api/items/report
// @access  Private
exports.reportLostItem = async (req, res) => {
  try {
    const { itemName, category, description, locationLost, dateLost, phone, photos } = req.body;

    // Validate required fields
    if (!itemName || !category || !locationLost || !dateLost) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new item report
    const item = await Item.create({
      itemName,
      category,
      description: description || '',
      locationLost,
      dateLost,
      phone: phone || '',
      photos: photos || [],
      reportedBy: req.user._id,
      status: 'lost'
    });

    res.status(201).json({
      success: true,
      message: 'Lost item reported successfully',
      item
    });
  } catch (error) {
    console.error('❌ Report Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while reporting item'
    });
  }
};

// @desc    Get all lost items
// @route   GET /api/items/lost
// @access  Public
exports.getLostItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'lost' })
      .populate('reportedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('❌ Get Items Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching items'
    });
  }
};

// @desc    Get items reported by current user
// @route   GET /api/items/my-reports
// @access  Private
exports.getMyReports = async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('❌ Get My Reports Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching your reports'
    });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reportedBy', 'name email phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      item
    });
  } catch (error) {
    console.error('❌ Get Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching item'
    });
  }
};

// @desc    Update item report
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the owner
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('❌ Update Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating item'
    });
  }
};

// @desc    Delete item report
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the owner
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting item'
    });
  }
};