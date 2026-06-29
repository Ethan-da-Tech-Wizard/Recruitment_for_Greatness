#!/usr/bin/env python3
"""
Initialize the Shea PARC Admin database.
Run this script before first use.
"""

import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from shared.database import init_database, DB_PATH

if __name__ == '__main__':
    print("=" * 50)
    print("Shea PARC Admin Pipeline")
    print("Database Initialization")
    print("=" * 50)
    
    if os.path.exists(DB_PATH):
        response = input(f"\nDatabase already exists at:\n{DB_PATH}\n\nReinitialize? (y/N): ")
        if response.lower() != 'y':
            print("Keeping existing database.")
            sys.exit(0)
    
    init_database()
    print("\nDatabase ready!")
    print(f"Location: {DB_PATH}")
    print("\nYou can now run the applications:")
    print("  python public_app/app.py   (Public Form)")
    print("  python admin_app/app.py    (Admin Dashboard)")
