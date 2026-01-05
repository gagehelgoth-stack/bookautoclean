# Book Auto Clean

Professional auto detailing booking platform for bookautoclean.com

## Project Overview

Book Auto Clean is a comprehensive booking platform for auto detailing services, featuring:
- Multi-detailer marketplace
- Automated booking system
- Customer account management
- Admin calendar management
- Payment integration (PayPal, Venmo, Cash App)

## Current Status

**Phase 1: Basic Website (In Progress)**
- ✅ Basic index.html created
- 🔄 Deployment setup in progress
- ⏳ DNS configuration pending

## Deployment Instructions

### Option 1: GitHub Pages (Recommended for now)
1. Go to repository Settings > Pages
2. Select branch: `claude/auto-detailing-website-LOtT1`
3. Select folder: `/ (root)`
4. Save

### Option 2: Custom Hosting
- The site is ready to deploy to any static hosting provider
- Simply upload all files from this repository

## DNS Configuration for bookautoclean.com

To point your Microsoft 365 domain to this site:

1. **For GitHub Pages:**
   - Create a `CNAME` file in the root directory with content: `bookautoclean.com`
   - In your Microsoft 365 admin center, add DNS records:
     - Type: CNAME
     - Host: www
     - Points to: `[your-github-username].github.io`
     - Type: A (for apex domain)
     - Host: @
     - Points to GitHub IPs:
       - 185.199.108.153
       - 185.199.109.153
       - 185.199.110.153
       - 185.199.111.153

2. **For custom hosting:**
   - Update A records to point to your hosting provider's IP
   - Update CNAME for www subdomain

## Next Steps

1. ✅ Create basic homepage
2. Deploy to GitHub Pages
3. Configure DNS
4. Build booking system
5. Add database integration
6. Implement user authentication
7. Create admin dashboard
8. Add payment processing

## Tech Stack (Planned)

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js (planned)
- Database: MongoDB (planned)
- Hosting: GitHub Pages → Custom hosting
- Payments: PayPal, Venmo, Cash App APIs

## Featured Detailer

**Elevated Auto Detail**
- Location: Hays, KS
- Rating: ⭐⭐⭐⭐⭐
- Experience: 5+ years
- Specialty: Premium auto detailing and truck polishing
