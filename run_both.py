#!/usr/bin/env python3
"""
Launch both applications simultaneously.
Use this for job fairs and recruitment events.
"""

import os
import sys
import threading
import socket

# Add project root to path
sys.path.insert(0, os.path.dirname(__file__))

from public_app.app import app as public_app
from admin_app.app import app as admin_app

def get_local_ip():
    """Get the local IP address for LAN access."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def run_public():
    """Run the public form app."""
    public_app.run(host='0.0.0.0', port=5000, debug=False, threaded=True, use_reloader=False)

def run_admin():
    """Run the admin dashboard app."""
    admin_app.run(host='127.0.0.1', port=5001, debug=False, threaded=True, use_reloader=False)

if __name__ == '__main__':
    local_ip = get_local_ip()
    
    print("\n" + "=" * 70)
    print("   SANTÉ OF MESA RECRUITMENT PIPELINE")
    print("   Both Applications Starting...")
    print("=" * 70)
    print("\n   PUBLIC FORM (Share with candidates):")
    print(f"     - Local:  http://localhost:5000")
    print(f"     - LAN:    http://{local_ip}:5000")
    print("\n   ADMIN DASHBOARD (Recruiters only):")
    print(f"     - URL:    http://localhost:5001")
    print("\n   Press Ctrl+C to stop both applications.")
    print("=" * 70 + "\n")
    
    # Start both apps in separate threads
    public_thread = threading.Thread(target=run_public, daemon=True)
    admin_thread = threading.Thread(target=run_admin, daemon=True)
    
    public_thread.start()
    admin_thread.start()
    
    # Keep main thread alive
    try:
        while True:
            public_thread.join(1)
            admin_thread.join(1)
    except KeyboardInterrupt:
        print("\n\nShutting down both applications...")
        sys.exit(0)
