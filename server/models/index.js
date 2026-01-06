// Export all models from a single file for easy importing
const User = require('./User');
const Detailer = require('./Detailer');
const Booking = require('./Booking');
const Availability = require('./Availability');

module.exports = {
    User,
    Detailer,
    Booking,
    Availability
};
