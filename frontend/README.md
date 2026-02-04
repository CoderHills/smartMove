# SmartMove Frontend

Complete React + Vite moving services platform with role-based dashboards.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

- ✅ 11 Pages (Home, Login, Register, 3 Dashboards, Booking, Inventory, Tracking, Confirm)
- ✅ 3 Sidebars (Client, Mover, Admin)
- ✅ Role-based routing
- ✅ Sample data included
- ✅ Professional styling
- ✅ Responsive design

## Pages

| URL | Page |
|-----|------|
| `/` | Home |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Client Dashboard |
| `/inventory` | Inventory |
| `/booking` | Booking |
| `/confirm-booking` | Confirm |
| `/tracking` | Tracking |
| `/mover/dashboard` | Mover Dashboard |
| `/mover/jobs` | Mover Jobs |
| `/admin/dashboard` | Admin Dashboard |

## Project Structure

```
src/
├── main.jsx           # Entry point
├── App.jsx            # Routes
├── components/        # Reusable components
├── pages/            # Page components
└── styles/           # CSS files
```

## Test Credentials

Register with any email/password and select:
- **Client** → Redirects to `/dashboard`
- **Mover** → Redirects to `/mover/dashboard`
- **Admin** → Redirects to `/admin/dashboard`

## Sample Data

**Movers:**
- Swift Movers Ltd (4.8★, KES 15,000)
- Premium Relocations (4.9★, KES 18,500)
- Easy Move Services (4.6★, KES 13,500)
- City Movers Pro (4.7★, KES 16,000)

**Inventory Templates:**
- Bedsitter (12 items)
- Studio (15 items)
- 1 Bedroom (18 items)
- 2 Bedrooms (24 items)

## Tech Stack

- React 18
- React Router v6
- Vite
- Lucide React (icons)

## Notes

- Standalone frontend (no backend required)
- Uses hardcoded sample data
- Perfect for UI/UX testing
- Ready for backend integration
