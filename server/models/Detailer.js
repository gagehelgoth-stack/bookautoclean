const mongoose = require('mongoose');

const detailerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    businessName: {
        type: String,
        required: [true, 'Please provide a business name'],
        trim: true
    },
    bio: {
        type: String,
        maxlength: 500
    },
    experience: {
        type: Number, // Years of experience
        min: 0
    },
    specialty: {
        type: [String],
        default: []
    },
    location: {
        address: String,
        city: String,
        state: String,
        zipCode: {
            type: String,
            required: [true, 'Please provide a zip code']
        },
        latitude: Number,
        longitude: Number
    },
    serviceArea: {
        type: [String], // Array of zip codes they serve
        default: []
    },
    rating: {
        average: {
            type: Number,
            default: 5.0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    pricing: {
        basic: Number,
        standard: Number,
        premium: Number,
        custom: [{
            name: String,
            price: Number,
            description: String
        }]
    },
    services: [{
        name: String,
        description: String,
        duration: Number, // in minutes
        price: Number
    }],
    availability: {
        // Default hours for each day of the week
        monday: { start: String, end: String, available: Boolean },
        tuesday: { start: String, end: String, available: Boolean },
        wednesday: { start: String, end: String, available: Boolean },
        thursday: { start: String, end: String, available: Boolean },
        friday: { start: String, end: String, available: Boolean },
        saturday: { start: String, end: String, available: Boolean },
        sunday: { start: String, end: String, available: Boolean }
    },
    commissionRate: {
        type: Number,
        default: 0.15, // 15% for using the platform
        min: 0,
        max: 1
    },
    paymentMethods: {
        paypal: String,
        venmo: String,
        cashApp: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate and update average rating
detailerSchema.methods.updateRating = function() {
    if (this.reviews.length === 0) {
        this.rating.average = 5.0;
        this.rating.count = 0;
        return;
    }

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = (sum / this.reviews.length).toFixed(1);
    this.rating.count = this.reviews.length;
};

const Detailer = mongoose.model('Detailer', detailerSchema);

module.exports = Detailer;
