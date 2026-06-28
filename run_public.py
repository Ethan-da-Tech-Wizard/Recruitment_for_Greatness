#!/usr/bin/env python3
"""
Launch the Public Form Application.
This is for candidates at job fairs.
"""

import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from public_app.app import app, get_local_ip

if __name__ == '__main__':
    local_ip = get_local_ip()
    print("\n" + "=" * 60)
    print("   SHEA PARC - PUBLIC RECRUITMENT FORM")
    print("=" * 60)
    print(f"\n   Local Access:  http://localhost:5000")
    print(f"   LAN Access:    http://{local_ip}:5000")
    print("\n   Share the LAN URL with candidates at job fairs!")
    print("=" * 60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
