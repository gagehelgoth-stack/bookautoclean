# Book Auto Clean - Backend Server

Node.js/Express backend API for the Book Auto Clean booking platform.

## Features

- RESTful API for booking management
- MongoDB database integration
- User and detailer management
- Availability and scheduling system
- Commission-based payment tracking
- Rating and review system

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure MongoDB

Make sure you have MongoDB Atlas set up and your connection string in the `.env` file at the root:

```
MONGODB_URI=mongodb+srv://ghelgoth:Helgoth$$@cluster0.xxxxx.mongodb.net/bookautoclean?retryWrites=true&w=majority
```

### 3. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings (with filters)
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Detailers
- `GET /api/detailers` - Get all detailers (with search/filter)
- `GET /api/detailers/:id` - Get single detailer
- `GET /api/detailers/:id/availability` - Get detailer availability
- `POST /api/detailers/:id/availability` - Set availability
- `POST /api/detailers/:id/reviews` - Add review

### Health Check
- `GET /api/health` - Server health check

## Database Models

### User
- Customer and detailer authentication
- Profile information
- Role-based access

### Detailer
- Business information
- Services and pricing
- Ratings and reviews
- Availability schedule
- Commission rate (15% default)

### Booking
- Appointment details
- Customer and detailer references
- Payment tracking
- Status management

### Availability
- Time slot management
- Hourly slots (7 AM - 7 PM)
- Blocked dates
- Booking references

## Environment Variables

Required in `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
SITE_URL=https://bookautoclean.com
```

## Next Steps

1. Complete MongoDB Atlas setup
2. Add authentication (JWT)
3. Add payment integration (PayPal, Venmo, Cash App)
4. Add email notifications
5. Deploy to Render or Heroku

## Deployment

The backend can be deployed separately from the frontend:
- **Recommended**: Render, Heroku, or Railway
- **Database**: MongoDB Atlas (free tier)
- **Frontend**: GitHub Pages (already set up)

The frontend will make API calls to your deployed backend URL.
