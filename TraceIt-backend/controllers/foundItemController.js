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
      phone, 
      securityQuestion, 
      securityAnswer, 
      photos 
    } = req.body;

    if (!itemName || !category || !locationFound || !dateFound || !securityQuestion || !securityAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const foundItem = await FoundItem.create({
      itemName,
      category,
      locationFound,
      dateFound,
      phone: phone || '',
      securityQuestion,
      securityAnswer,
      photos: photos || [],
      foundBy: req.user._id,
      status: 'found'
    });

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
      .populate('foundBy', 'name email phone')
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
      .populate('foundBy', 'name email phone');

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

// --------------------------------------------------------
// ✅ UPDATED SECURITY VERIFICATION WITH PARTIAL MATCHING
// --------------------------------------------------------

// @desc    Verify security answer
// @route   POST /api/found-items/:id/verify
// @access  Public
exports.verifySecurityAnswer = async (req, res) => {
  try {
    const { securityAnswer } = req.body;

    if (!securityAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an answer'
      });
    }

    const foundItem = await FoundItem.findById(req.params.id)
      .select('+securityAnswer')
      .populate('foundBy', 'name email phone');

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const userAns = securityAnswer.trim().toLowerCase();
    const correctAns = foundItem.securityAnswer.trim().toLowerCase();

    const similarity = calculateSimilarity(userAns, correctAns);
    const partial =
      correctAns.includes(userAns) || userAns.includes(correctAns);

    if (similarity >= 0.7 || partial) {
      // Get phone from foundItem or foundBy user
      const phone = foundItem.phone || foundItem.foundBy.phone || null;

      return res.status(200).json({
        success: true,
        message: 'Verification successful',
        contactInfo: {
          name: foundItem.foundBy.name,
          email: foundItem.foundBy.email,
          phone: phone
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Incorrect answer. Please try again.'
    });

  } catch (error) {
    console.error('❌ Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
};

// Helper: Similarity
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
  for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

// --------------------------------------------------------
// REMAINING CONTROLLERS (UNCHANGED)
// --------------------------------------------------------

exports.updateFoundItem = async (req, res) => {
  try {
    let foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

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

exports.deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

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

exports.markAsClaimed = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({
        success: false,
        message: 'Found item not found'
      });
    }

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