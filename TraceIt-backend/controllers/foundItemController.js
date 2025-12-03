const FoundItem = require('../models/FoundItem');

// @desc    Report a found item
// @route   POST /api/found-items/report
// @access  Private
exports.reportFoundItem = async (req, res) => {
  try {
    const { 
      itemName, 
      category, 
      locationFound, 
      dateFound, 
      securityQuestion, 
      securityAnswer, 
      photos 
    } = req.body;

    // Validate required fields
    if (!itemName || !category || !locationFound || !dateFound || !securityQuestion || !securityAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new found item report
    const foundItem = await FoundItem.create({
      itemName,
      category,
      locationFound,
      dateFound,
      securityQuestion,
      securityAnswer,
      photos: photos || [],
      foundBy: req.user._id,
      status: 'found'
    });

    // Return without security answer
    const foundItemResponse = await FoundItem.findById(foundItem._id);

    res.status(201).json({
      success: true,
      message: 'Found item reported successfully',
      foundItem: foundItemResponse
    });
  } catch (error) {
    console.error('❌ Report Found Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while reporting found item'
    });
  }
};

// @desc    Get all found items
// @route   GET /api/found-items
// @access  Public
exports.getFoundItems = async (req, res) => {
  try {
    const foundItems = await FoundItem.find({ status: 'found' })
      .populate('foundBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foundItems.length,
      foundItems
    });
  } catch (error) {
    console.error('❌ Get Found Items Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching found items'
    });
  }
};

// @desc    Get found items reported by current user
// @route   GET /api/found-items/my-reports
// @access  Private
exports.getMyFoundReports = async (req, res) => {
  try {
    const foundItems = await FoundItem.find({ foundBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: foundItems.length,
      foundItems
    });
  } catch (error) {
    console.error('❌ Get My Found Reports Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching your reports'
    });
  }
};

// @desc    Get single found item by ID
// @route   GET /api/found-items/:id
// @access  Public
exports.getFoundItemById = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id)
      .populate('foundBy', 'name email');

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    res.status(200).json({
      success: true,
      foundItem
    });
  } catch (error) {
    console.error('❌ Get Found Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching found item'
    });
  }
};

// @desc    Verify security answer for claiming an item
// @route   POST /api/found-items/:id/verify
// @access  Public
exports.verifySecurityAnswer = async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an answer'
      });
    }

    // Get found item with security answer
    const foundItem = await FoundItem.findById(req.params.id)
      .select('+securityAnswer')
      .populate('foundBy', 'name email');

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Compare answers (case-insensitive)
    const isMatch = answer.trim().toLowerCase() === foundItem.securityAnswer.trim().toLowerCase();

    if (isMatch) {
      res.status(200).json({
        success: true,
        message: 'Verification successful! Contact the finder.',
        contact: {
          name: foundItem.foundBy.name,
          email: foundItem.foundBy.email
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Incorrect answer. Please try again.'
      });
    }
  } catch (error) {
    console.error('❌ Verify Answer Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during verification'
    });
  }
};

// @desc    Update found item report
// @route   PUT /api/found-items/:id
// @access  Private (only item finder)
exports.updateFoundItem = async (req, res) => {
  try {
    let foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Check if user is the finder
    if (foundItem.foundBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    foundItem = await FoundItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Found item updated successfully',
      foundItem
    });
  } catch (error) {
    console.error('❌ Update Found Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating found item'
    });
  }
};

// @desc    Delete found item report
// @route   DELETE /api/found-items/:id
// @access  Private (only item finder)
exports.deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Check if user is the finder
    if (foundItem.foundBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await FoundItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Found item deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Found Item Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting found item'
    });
  }
};

// @desc    Mark found item as claimed
// @route   PUT /api/found-items/:id/claim
// @access  Private (only item finder)
exports.markAsClaimed = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

    // Check if user is the finder
    if (foundItem.foundBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    foundItem.status = 'claimed';
    await foundItem.save();

    res.status(200).json({
      success: true,
      message: 'Item marked as claimed',
      foundItem
    });
  } catch (error) {
    console.error('❌ Mark as Claimed Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while marking item as claimed'
    });
  }
};