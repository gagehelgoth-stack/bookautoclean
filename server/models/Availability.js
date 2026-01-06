const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    detailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Detailer',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlots: [{
        start: {
            type: String,
            required: true // Format: "07:00", "08:00", etc.
        },
        end: {
            type: String,
            required: true // Format: "08:00", "09:00", etc.
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        }
    }],
    isBlocked: {
        type: Boolean,
        default: false
    },
    blockReason: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient date-based queries
availabilitySchema.index({ detailer: 1, date: 1 }, { unique: true });

// Method to generate default time slots (7 AM to 7 PM, hourly)
availabilitySchema.statics.generateDefaultSlots = function() {
    const slots = [];
    const startHour = 7; // 7 AM
    const endHour = 19; // 7 PM

    for (let hour = startHour; hour < endHour; hour++) {
        const start = `${hour.toString().padStart(2, '0')}:00`;
        const end = `${(hour + 1).toString().padStart(2, '0')}:00`;

        slots.push({
            start,
            end,
            isAvailable: true
        });
    }

    return slots;
};

// Method to check if a time slot is available
availabilitySchema.methods.isSlotAvailable = function(startTime) {
    const slot = this.timeSlots.find(s => s.start === startTime);
    return slot && slot.isAvailable && !this.isBlocked;
};

// Method to book a time slot
availabilitySchema.methods.bookSlot = function(startTime, bookingId) {
    const slot = this.timeSlots.find(s => s.start === startTime);
    if (slot && slot.isAvailable) {
        slot.isAvailable = false;
        slot.booking = bookingId;
        return true;
    }
    return false;
};

// Method to cancel a booking and free up the slot
availabilitySchema.methods.cancelSlot = function(startTime) {
    const slot = this.timeSlots.find(s => s.start === startTime);
    if (slot) {
        slot.isAvailable = true;
        slot.booking = null;
        return true;
    }
    return false;
};

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
