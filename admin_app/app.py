#!/usr/bin/env python3
"""
Admin Dashboard Application for Shea Post Acute Rehabilitation Center Admin.
This is the admin-facing application for managing candidates.
"""

import os
import sys
from io import StringIO

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, Response, session
from shared.database import (
    get_all_candidates, get_candidate_by_id, update_candidate_status,
    update_candidate_notes, get_status_counts, delete_candidate,
    export_to_csv, init_database, STATUS_OPTIONS, DEPARTMENTS
)

# Initialize Flask app
app = Flask(__name__,
            template_folder='../templates/admin',
            static_folder='../static')
app.secret_key = 'shea-parc-admin-2026'
ADMIN_PIN = os.environ.get('ADMIN_PIN', '1234')

# Ensure database exists
init_database()


@app.before_request
def require_admin_pin():
    """Require the admin PIN before showing admin data."""
    open_endpoints = {'login', 'health_check', 'static'}
    if request.endpoint in open_endpoints:
        return None
    if session.get('admin_authenticated'):
        return None
    return redirect(url_for('login', next=request.full_path if request.query_string else request.path))


@app.route('/login', methods=['GET', 'POST'])
def login():
    """PIN login page for admins."""
    next_url = request.args.get('next') or url_for('dashboard')
    if not next_url.startswith('/'):
        next_url = url_for('dashboard')
    if request.method == 'POST':
        pin = request.form.get('pin', '')
        next_url = request.form.get('next') or url_for('dashboard')
        if not next_url.startswith('/'):
            next_url = url_for('dashboard')
        if pin == ADMIN_PIN:
            session['admin_authenticated'] = True
            flash('Welcome back to the Shea dashboard.', 'success')
            return redirect(next_url)
        flash('That PIN did not match. Please try again.', 'error')

    return render_template('login.html', next_url=next_url)


@app.route('/logout')
def logout():
    """Log admins out of the admin dashboard."""
    session.pop('admin_authenticated', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))


@app.route('/')
def dashboard():
    """Main dashboard page."""
    status_filter = request.args.get('status', 'all')
    search_query = request.args.get('search', '')
    
    candidates = get_all_candidates(status_filter, search_query)
    status_counts = get_status_counts()
    
    return render_template('dashboard.html',
                          candidates=candidates,
                          status_counts=status_counts,
                          status_options=STATUS_OPTIONS,
                          current_status=status_filter,
                          search_query=search_query)


@app.route('/candidate/<int:candidate_id>')
def view_candidate(candidate_id):
    """View individual candidate details."""
    candidate = get_candidate_by_id(candidate_id)
    if not candidate:
        flash('Candidate not found.', 'error')
        return redirect(url_for('dashboard'))
    
    return render_template('candidate.html',
                          candidate=candidate,
                          status_options=STATUS_OPTIONS)


@app.route('/candidate/<int:candidate_id>/status', methods=['POST'])
def update_status(candidate_id):
    """Update candidate status."""
    new_status = request.form.get('status')
    if new_status:
        update_candidate_status(candidate_id, new_status)
        flash('Status updated successfully.', 'success')
    return redirect(url_for('view_candidate', candidate_id=candidate_id))


@app.route('/candidate/<int:candidate_id>/notes', methods=['POST'])
def update_notes(candidate_id):
    """Update candidate notes."""
    notes = request.form.get('notes', '')
    update_candidate_notes(candidate_id, notes)
    flash('Notes saved successfully.', 'success')
    return redirect(url_for('view_candidate', candidate_id=candidate_id))


@app.route('/candidate/<int:candidate_id>/delete', methods=['POST'])
def delete_candidate_route(candidate_id):
    """Delete a candidate."""
    delete_candidate(candidate_id)
    flash('Candidate removed.', 'success')
    return redirect(url_for('dashboard'))


@app.route('/export')
def export_data():
    """Export candidates to CSV."""
    csv_data = export_to_csv()
    return Response(
        csv_data,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=shea_parc_candidates.csv'}
    )


@app.route('/api/candidates')
def api_candidates():
    """API endpoint for candidates (for AJAX updates)."""
    status_filter = request.args.get('status', 'all')
    search_query = request.args.get('search', '')
    candidates = get_all_candidates(status_filter, search_query)
    return jsonify(candidates)


@app.route('/api/candidate/<int:candidate_id>/status', methods=['POST'])
def api_update_status(candidate_id):
    """API endpoint for updating status."""
    data = request.get_json()
    new_status = data.get('status')
    if new_status:
        update_candidate_status(candidate_id, new_status)
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'No status provided'})


@app.route('/api/candidate/<int:candidate_id>/notes', methods=['POST'])
def api_update_notes(candidate_id):
    """API endpoint for updating notes."""
    data = request.get_json()
    notes = data.get('notes', '')
    update_candidate_notes(candidate_id, notes)
    return jsonify({'success': True})


@app.route('/api/counts')
def api_counts():
    """API endpoint for status counts."""
    counts = get_status_counts()
    return jsonify(counts)


@app.route('/api/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'ok', 'app': 'admin'})


def get_local_ip():
    """Get the local IP address."""
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
    print("   SHEA PARC - ADMIN DASHBOARD")
    print("=" * 60)
    print(f"\n   Access URL:  http://localhost:5001")
    print("\n   This dashboard is for admins only.")
    print("   Do NOT share this URL with candidates.")
    print("=" * 60 + "\n")
    
    # Run on different port than public app
    app.run(host='127.0.0.1', port=5001, debug=False, threaded=True)
