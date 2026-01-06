const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    detailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Detailer',
        required: true
    },
    service: {
        name: {
            type: String,
            required: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        },
        duration: Number // in minutes
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Please provide an appointment date']
    },
    timeSlot: {
        start: {
            type: String,
            required: true // Format: "09:00"
        },
        end: {
            type: String,
            required: true // Format: "10:00"
        }
    },
    location: {
        type: {
            type: String,
            enum: ['mobile', 'shop'],
            default: 'mobile'
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String
        }
    },
    vehicleInfo: {
        make: String,
        model: String,
        year: Number,
        color: String,
        licensePlate: String
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
        default: 'pending'
    },
    payment: {
        method: {
            type: String,
            enum: ['paypal', 'venmo', 'cashapp', 'cash'],
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'refunded'],
            default: 'pending'
        },
        amount: {
            type: Number,
            required: true
        },
        platformFee: {
            type: Number,
            default: 0
        },
        detailerAmount: {
            type: Number,
            required: true
        },
        transactionId: String,
        paidAt: Date
    },
    notes: {
        customer: String,
        detailer: String,
        internal: String
    },
    reminders: {
        sent24h: { type: Boolean, default: false },
        sent2h: { type: Boolean, default: false }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate platform fee and detailer amount before saving
bookingSchema.pre('save', function(next) {
    if (this.isModified('payment.amount')) {
        // Assuming 15% commission
        this.payment.platformFee = this.payment.amount * 0.15;
        this.payment.detailerAmount = this.payment.amount - this.payment.platformFee;
    }
    next();
});

// Index for efficient querying
bookingSchema.index({ detailer: 1, appointmentDate: 1 });
bookingSchema.index({ customer: 1, appointmentDate: 1 });
bookingSchema.index({ status: 1, appointmentDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
