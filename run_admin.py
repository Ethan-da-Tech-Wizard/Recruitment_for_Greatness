#!/usr/bin/env python3
"""
Launch the Admin Dashboard Application.
This is for recruiters to manage candidates.
"""

import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from admin_app.app import app

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("   SHEA PARC - ADMIN DASHBOARD")
    print("=" * 60)
    print(f"\n   Access URL:  http://localhost:5001")
    print("\n   This dashboard is for recruiters only.")
    print("   Do NOT share this URL with candidates.")
    print("=" * 60 + "\n")
    
    app.run(host='127.0.0.1', port=5001, debug=False, threaded=True)
