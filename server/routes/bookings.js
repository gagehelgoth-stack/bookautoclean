const express = require('express');
const router = express.Router();
const { Booking, Detailer, Availability } = require('../models');

// @route   GET /api/bookings
// @desc    Get all bookings (with filters)
// @access  Public (will be protected later)
router.get('/', async (req, res) => {
    try {
        const { customer, detailer, status, date } = req.query;
        const filter = {};

        if (customer) filter.customer = customer;
        if (detailer) filter.detailer = detailer;
        if (status) filter.status = status;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            filter.appointmentDate = { $gte: startDate, $lt: endDate };
        }

        const bookings = await Booking.find(filter)
            .populate('customer', 'name email phone')
            .populate('detailer', 'businessName rating location')
            .sort({ appointmentDate: 1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching bookings'
        });
    }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public (will be protected later)
router.post('/', async (req, res) => {
    try {
        const {
            customer,
            detailer,
            service,
            appointmentDate,
            timeSlot,
            location,
            vehicleInfo,
            paymentMethod
        } = req.body;

        // Check if time slot is available
        const availability = await Availability.findOne({
            detailer,
            date: new Date(appointmentDate)
        });

        if (!availability || !availability.isSlotAvailable(timeSlot.start)) {
            return res.status(400).json({
                success: false,
                error: 'Selected time slot is not available'
            });
        }

        // Create booking
        const booking = new Booking({
            customer,
            detailer,
            service,
            appointmentDate,
            timeSlot,
            location,
            vehicleInfo,
            payment: {
                method: paymentMethod,
                amount: service.price
            }
        });

        await booking.save();

        // Update availability
        availability.bookSlot(timeSlot.start, booking._id);
        await availability.save();

        // Update detailer total bookings
        await Detailer.findByIdAndUpdate(detailer, {
            $inc: { totalBookings: 1 }
        });

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            error: 'Server error creating booking'
        });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Public (will be protected later)
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('customer', 'name email phone address')
            .populate('detailer', 'businessName rating location paymentMethods');

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({
            success: false,
            error: 'Server error fetching booking'
        });
    }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Public (will be protected later)
router.put('/:id', async (req, res) => {
    try {
        const { status, notes } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        if (status) booking.status = status;
        if (notes) booking.notes = { ...booking.notes, ...notes };

        await booking.save();

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({
            success: false,
            error: 'Server error updating booking'
        });
    }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Public (will be protected later)
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Free up the time slot
        const availability = await Availability.findOne({
            detailer: booking.detailer,
            date: booking.appointmentDate
        });

        if (availability) {
            availability.cancelSlot(booking.timeSlot.start);
            await availability.save();
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({
            success: false,
            error: 'Server error cancelling booking'
        });
    }
});

module.exports = router;
