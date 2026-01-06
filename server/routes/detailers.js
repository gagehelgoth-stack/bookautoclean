const express = require('express');
const router = express.Router();
const { Detailer, Availability } = require('../models');

// @route   GET /api/detailers
// @desc    Get all detailers (with search/filter)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { zipCode, featured, minRating } = req.query;
        const filter = {};

        if (zipCode) {
            filter.$or = [
                { 'location.zipCode': zipCode },
                { serviceArea: zipCode }
            ];
        }

        if (featured === 'true') {
            filter.isFeatured = true;
        }

        if (minRating) {
            filter['rating.average'] = { $gte: parseFloat(minRating) };
        }

        const detailers = await Detailer.find(filter)
            .populate('userId', 'name email phone')
            .sort({ isFeatured: -1, 'rating.average': -1 });

        res.json({
            success: true,
            count: detailers.length,
            data: detailers
        });
    } catch (error) {
        console.error('Error fetching detailers:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching detailers'
        });
    }
});

// @route   GET /api/detailers/:id
// @desc    Get single detailer by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const detailer = await Detailer.findById(req.params.id)
            .populate('userId', 'name email phone');

        if (!detailer) {
            return res.status(404).json({
                success: false,
                error: 'Detailer not found'
            });
        }

        res.json({
            success: true,
            data: detailer
        });
    } catch (error) {
        console.error('Error fetching detailer:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching detailer'
        });
    }
});

// @route   GET /api/detailers/:id/availability
// @desc    Get detailer availability for a date range
// @access  Public
router.get('/:id/availability', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate) {
            return res.status(400).json({
                success: false,
                error: 'Start date is required'
            });
        }

        const filter = {
            detailer: req.params.id,
            date: {
                $gte: new Date(startDate),
                $lte: endDate ? new Date(endDate) : new Date(startDate)
            }
        };

        const availability = await Availability.find(filter).sort({ date: 1 });

        res.json({
            success: true,
            count: availability.length,
            data: availability
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching availability'
        });
    }
});

// @route   POST /api/detailers/:id/availability
// @desc    Set availability for a specific date
// @access  Private (detailer/admin only)
router.post('/:id/availability', async (req, res) => {
    try {
        const { date, timeSlots, isBlocked, blockReason } = req.body;

        // Check if availability already exists for this date
        let availability = await Availability.findOne({
            detailer: req.params.id,
            date: new Date(date)
        });

        if (availability) {
            // Update existing
            availability.timeSlots = timeSlots || availability.timeSlots;
            availability.isBlocked = isBlocked !== undefined ? isBlocked : availability.isBlocked;
            availability.blockReason = blockReason || availability.blockReason;
        } else {
            // Create new
            availability = new Availability({
                detailer: req.params.id,
                date: new Date(date),
                timeSlots: timeSlots || Availability.generateDefaultSlots(),
                isBlocked: isBlocked || false,
                blockReason
            });
        }

        await availability.save();

        res.json({
            success: true,
            data: availability
        });
    } catch (error) {
        console.error('Error setting availability:', error);
        res.status(500).json({
            success: false,
            error: 'Server error setting availability'
        });
    }
});

// @route   POST /api/detailers/:id/reviews
// @desc    Add a review for a detailer
// @access  Private (customer only)
router.post('/:id/reviews', async (req, res) => {
    try {
        const { userId, rating, comment } = req.body;

        const detailer = await Detailer.findById(req.params.id);

        if (!detailer) {
            return res.status(404).json({
                success: false,
                error: 'Detailer not found'
            });
        }

        // Add review
        detailer.reviews.push({
            user: userId,
            rating,
            comment
        });

        // Update rating
        detailer.updateRating();

        await detailer.save();

        res.json({
            success: true,
            data: detailer
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            success: false,
            error: 'Server error adding review'
        });
    }
});

module.exports = router;
