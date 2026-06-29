# Shea PARC Admin Pipeline

## Overview
A professional, inviting admin application designed for job fairs and in-person hiring events. This two-app system allows potential candidates to fill out interest forms while admins manage and track follow-ups through a separate admin interface.

---

## Data Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SHEA PARC ADMIN PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────┐         ┌──────────────────────┐                 │
│  │   PUBLIC FORM APP    │         │   ADMIN DASHBOARD    │                 │
│  │   (Port 5000)        │         │   (Port 5001)        │                 │
│  │                      │         │                      │                 │
│  │  • Candidate Form    │         │  • View All Leads    │                 │
│  │  • Company Info      │         │  • Filter by Status  │                 │
│  │  • Team Showcase     │         │  • Add Notes         │                 │
│  │  • Building Info     │         │  • Update Status     │                 │
│  │                      │         │  • Export Data       │                 │
│  └──────────┬───────────┘         └──────────┬───────────┘                 │
│             │                                │                              │
│             │         ┌──────────┐           │                              │
│             └────────►│  SQLite  │◄──────────┘                              │
│                       │ Database │                                          │
│                       │(Shared)  │                                          │
│                       └──────────┘                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         LAN ACCESS                                   │   │
│  │  Candidates can access form via phone by connecting to laptop WiFi   │   │
│  │  URL: http://<laptop-ip>:5000                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Component | Technology | Reason |
|-----------|------------|--------|
| Backend | Python 3.x + Flask | Lightweight, easy to deploy, low resource usage |
| Database | SQLite | Local storage, no server needed, portable |
| Frontend | HTML5 + CSS3 + Vanilla JS | No build tools, works offline, fast loading |
| Styling | Custom CSS (Deep Teal, Amber, White) | Brand colors, professional appearance |

### Why This Stack?
- **Low Resource Requirements**: Runs on 4-8GB RAM, no GPU needed
- **Offline Capable**: Everything runs locally
- **LAN Accessible**: Flask serves over network for phone access
- **Portable**: Single folder, easy to copy to other laptops
- **No Dependencies Hell**: Minimal Python packages required

---

## System Requirements

- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **CPU**: Any modern processor (no GPU required)
- **Storage**: 100MB for app + database growth
- **Python**: 3.8 or higher

---

## Installation

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Initialize Database
```bash
python shared/init_db.py
```

The SQLite database is created locally at `shared/shea_parc_data.db` and is ignored by Git. Each laptop keeps its own candidate data offline.

### 3. Run the Applications

**Terminal 1 - Public Form App:**
```bash
python public_app/app.py
```

**Terminal 2 - Admin Dashboard:**
```bash
python admin_app/app.py
```

Or run both at once:
```bash
python run_both.py
```

### 4. Access the Apps
- **Public Form**: http://localhost:5000 (or http://<your-ip>:5000 for LAN)
- **Admin Dashboard**: http://localhost:5001

---

## Features

### Public Form App (Candidate-Facing)
- Professional interest form with contact details
- Best time to call selector
- Department interest selection
- About Shea PARC section with facility overview
- Shea Post Acute Rehabilitation Center building showcase
- Team photo galleries by department
- Mobile-responsive design

### Admin Dashboard (Admin-Facing)
- View all submitted leads
- Filter by status:
  - New (Uncontacted)
  - Called - No Answer
  - Already Called
  - Do Not Call
  - Interested
  - Not Interested
  - Interested but Conflicts
- Individual candidate notes
- Search functionality
- Export to CSV
- Real-time updates

---

## Color Scheme

| Color | Hex Code | Usage |
|-------|----------|-------|
| Deep Teal | #005F73 | Primary headers, buttons |
| Amber | #EE9B00 | Accents, highlights, hover states |
| White | #FFFFFF | Background, text on dark |
| Soft Teal | #EDF6F4 | Secondary backgrounds |

---

## Database Schema

```sql
CREATE TABLE candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    best_time_to_call TEXT,
    departments_interested TEXT,
    experience_level TEXT,
    availability TEXT,
    commute_preference TEXT,
    how_heard_about_us TEXT,
    additional_info TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## LAN Setup for Job Fairs

1. Connect laptop to portable WiFi hotspot
2. Run both apps on laptop
3. Share the WiFi password with candidates
4. Candidates navigate to `http://<laptop-ip>:5000` on their phones
5. Forms submit directly to your local database

To find your IP address:
- **Windows**: `ipconfig` in Command Prompt
- **Mac/Linux**: `ifconfig` or `ip addr` in Terminal

---

## File Structure

```
Better_at_Shea/
├── README.md
├── requirements.txt
├── run_public.py          # Launch public app
├── run_admin.py           # Launch admin app
├── run_both.py            # Launch both apps
├── shared/
│   ├── __init__.py
│   ├── database.py        # Database operations
│   ├── init_db.py         # Database initialization
│   └── shea_parc_data.db  # Local SQLite database (created on init, ignored by Git)
├── public_app/
│   ├── __init__.py
│   └── app.py             # Public Flask app
├── admin_app/
│   ├── __init__.py
│   └── app.py             # Admin Flask app
├── static/
│   ├── css/
│   │   ├── common.css     # Shared styles
│   │   ├── public.css     # Public form styles
│   │   └── admin.css      # Admin dashboard styles
│   ├── js/
│   │   ├── public.js      # Public form scripts
│   │   └── admin.js       # Admin dashboard scripts
│   └── images/
│       ├── team/          # Team photos placeholder
│       ├── facility/      # Building photos placeholder
│       └── stock/         # Stock images
└── templates/
    ├── public/
    │   ├── index.html     # Main form page
    │   ├── about.html     # About Shea PARC page
    │   └── success.html   # Form submission success
    └── admin/
        ├── dashboard.html # Main dashboard
        └── candidate.html # Individual candidate view
```

---

## About Shea Post Acute Rehabilitation Center

*See the About section in the application for facility information and recruiting context.*

---

## License

Internal use only - Shea Post Acute Rehabilitation Center / Ensign Services

---

## Support

For technical issues, contact your IT administrator.
