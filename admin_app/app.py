#!/usr/bin/env python3
"""
Admin Dashboard Application for Shea Post Acute Rehabilitation Center Recruitment.
This is the recruiter-facing application for managing candidates.
"""

import os
import sys
from io import StringIO

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, Response
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

# Ensure database exists
init_database()


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
    print("\n   This dashboard is for recruiters only.")
    print("   Do NOT share this URL with candidates.")
    print("=" * 60 + "\n")
    
    # Run on different port than public app
    app.run(host='127.0.0.1', port=5001, debug=False, threaded=True)
