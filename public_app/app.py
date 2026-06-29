#!/usr/bin/env python3
"""
Public Form Application for Shea Post Acute Rehabilitation Center Admin.
This is the candidate-facing application for job fairs.
"""

import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from shared.database import add_candidate, init_database, DEPARTMENTS

# Initialize Flask app
app = Flask(__name__,
            template_folder='../templates/public',
            static_folder='../static')
app.secret_key = 'shea-parc-admin-2026'
ADMIN_DATABASE_URL = os.environ.get('ADMIN_DATABASE_URL', 'http://localhost:5001').rstrip('/')

# Ensure database exists
init_database()


@app.route('/')
def index():
    """Main form page."""
    return render_template('index.html', departments=DEPARTMENTS)


@app.route('/submit', methods=['POST'])
def submit_form():
    """Handle form submission."""
    try:
        # Collect form data
        data = {
            'first_name': request.form.get('first_name', '').strip(),
            'last_name': request.form.get('last_name', '').strip(),
            'email': request.form.get('email', '').strip(),
            'phone': request.form.get('phone', '').strip(),
            'best_time_to_call': request.form.get('best_time_to_call', ''),
            'departments_interested': request.form.getlist('departments'),
            'experience_level': request.form.get('experience_level', ''),
            'availability': request.form.get('availability', ''),
            'commute_preference': request.form.get('commute_preference', ''),
            'how_heard_about_us': request.form.get('how_heard_about_us', ''),
            'additional_info': request.form.get('additional_info', '')
        }
        
        # Basic validation
        if not data['first_name'] or not data['last_name']:
            flash('Please enter your first and last name.', 'error')
            return redirect(url_for('index'))
        
        if not data['phone']:
            flash('Please enter your phone number.', 'error')
            return redirect(url_for('index'))
        
        # Save to database
        candidate_id = add_candidate(data)
        
        return redirect(url_for('success'))
        
    except Exception as e:
        flash(f'An error occurred. Please try again.', 'error')
        return redirect(url_for('index'))


@app.route('/success')
def success():
    """Success page after form submission."""
    return render_template('success.html')


@app.route('/about')
def about():
    """About Shea PARC page."""
    return render_template('about.html')


@app.route('/database')
def database_entry():
    """Send admins to the PIN-protected candidate database."""
    return redirect(f'{ADMIN_DATABASE_URL}/login?next=/')


@app.route('/manifest.webmanifest')
def manifest():
    """Serve the installable app manifest."""
    return send_from_directory(app.static_folder, 'manifest.webmanifest', mimetype='application/manifest+json')


@app.route('/service-worker.js')
def service_worker():
    """Serve the service worker from the app root for install support."""
    return send_from_directory(app.static_folder, 'service-worker.js', mimetype='application/javascript')


@app.route('/api/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'app': 'public'})


def get_local_ip():
    """Get the local IP address for LAN access."""
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


if __name__ == '__main__':
    local_ip = get_local_ip()
    print("\n" + "=" * 60)
    print("   SHEA PARC - PUBLIC ADMIN FORM")
    print("=" * 60)
    print(f"\n   Local Access:  http://localhost:5000")
    print(f"   LAN Access:    http://{local_ip}:5000")
    print("\n   Share the LAN URL with candidates at job fairs!")
    print("=" * 60 + "\n")
    
    # Run with host='0.0.0.0' to allow LAN access
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)
