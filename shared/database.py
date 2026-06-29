"""
Database operations for Shea PARC Admin Pipeline.
Uses SQLite for local, offline-capable storage.
"""

import sqlite3
import os
from datetime import datetime
from contextlib import contextmanager

# Database file path (in shared folder)
DB_PATH = os.path.join(os.path.dirname(__file__), 'shea_parc_data.db')

# Status options for candidates
STATUS_OPTIONS = [
    ('new', 'New'),
    ('called_no_answer', 'No Answer'),
    ('already_called', 'Contacted'),
    ('do_not_call', 'Do Not Call'),
    ('interested', 'Interested'),
    ('not_interested', 'Not Interested'),
    ('interested_conflicts', 'Conflict')
]

# Department options
DEPARTMENTS = [
    'Nursing',
    'Certified Nursing Assistant (CNA)',
    'Culinary/Dietary',
    'Housekeeping/EVS',
    'Activities',
    'Social Services',
    'Case Management',
    'Therapy (PT/OT/ST)',
    'Administrative',
    'Maintenance',
    'Other'
]

@contextmanager
def get_db_connection():
    """Context manager for database connections."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_database():
    """Initialize the database with required tables."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Create candidates table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS candidates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT,
                phone TEXT NOT NULL,
                best_time_to_call TEXT,
                departments_interested TEXT,
                experience_level TEXT,
                availability TEXT,
                how_heard_about_us TEXT,
                additional_info TEXT,
                status TEXT DEFAULT 'new',
                notes TEXT DEFAULT '',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create index for faster status filtering
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_status ON candidates(status)
        ''')
        
        # Create index for search
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_name ON candidates(last_name, first_name)
        ''')

        cursor.execute('PRAGMA table_info(candidates)')
        existing_columns = {row['name'] for row in cursor.fetchall()}
        if 'commute_preference' not in existing_columns:
            cursor.execute('ALTER TABLE candidates ADD COLUMN commute_preference TEXT')
        
        conn.commit()
        print(f"Database initialized at: {DB_PATH}")


def add_candidate(data):
    """
    Add a new candidate to the database.
    
    Args:
        data: Dictionary with candidate information
        
    Returns:
        int: The ID of the newly created candidate
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Convert departments list to comma-separated string
        departments = data.get('departments_interested', [])
        if isinstance(departments, list):
            departments = ', '.join(departments)
        
        cursor.execute('''
            INSERT INTO candidates (
                first_name, last_name, email, phone,
                best_time_to_call, departments_interested,
                experience_level, availability,
                commute_preference, how_heard_about_us, additional_info
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('first_name', ''),
            data.get('last_name', ''),
            data.get('email', ''),
            data.get('phone', ''),
            data.get('best_time_to_call', ''),
            departments,
            data.get('experience_level', ''),
            data.get('availability', ''),
            data.get('commute_preference', ''),
            data.get('how_heard_about_us', ''),
            data.get('additional_info', '')
        ))
        
        conn.commit()
        return cursor.lastrowid


def get_all_candidates(status_filter=None, search_query=None):
    """
    Get all candidates, optionally filtered by status or search query.
    
    Args:
        status_filter: Filter by status (or None for all)
        search_query: Search in name, email, phone
        
    Returns:
        list: List of candidate dictionaries
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = 'SELECT * FROM candidates WHERE 1=1'
        params = []
        
        if status_filter and status_filter != 'all':
            query += ' AND status = ?'
            params.append(status_filter)
        
        if search_query:
            query += ''' AND (
                first_name LIKE ? OR 
                last_name LIKE ? OR 
                email LIKE ? OR 
                phone LIKE ?
            )'''
            search_term = f'%{search_query}%'
            params.extend([search_term, search_term, search_term, search_term])
        
        query += ' ORDER BY created_at DESC'
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        return [dict(row) for row in rows]


def get_candidate_by_id(candidate_id):
    """
    Get a single candidate by ID.
    
    Args:
        candidate_id: The candidate's ID
        
    Returns:
        dict: Candidate data or None if not found
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM candidates WHERE id = ?', (candidate_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def update_candidate_status(candidate_id, new_status):
    """
    Update a candidate's status.
    
    Args:
        candidate_id: The candidate's ID
        new_status: The new status value
        
    Returns:
        bool: True if updated successfully
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE candidates 
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (new_status, candidate_id))
        conn.commit()
        return cursor.rowcount > 0


def update_candidate_notes(candidate_id, notes):
    """
    Update a candidate's notes.
    
    Args:
        candidate_id: The candidate's ID
        notes: The new notes content
        
    Returns:
        bool: True if updated successfully
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE candidates 
            SET notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (notes, candidate_id))
        conn.commit()
        return cursor.rowcount > 0


def get_status_counts():
    """
    Get count of candidates for each status.
    
    Returns:
        dict: Status -> count mapping
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            SELECT status, COUNT(*) as count 
            FROM candidates 
            GROUP BY status
        ''')
        rows = cursor.fetchall()
        
        # Initialize with all statuses at 0
        counts = {status[0]: 0 for status in STATUS_OPTIONS}
        counts['all'] = 0
        
        for row in rows:
            counts[row['status']] = row['count']
            counts['all'] += row['count']
        
        return counts


def delete_candidate(candidate_id):
    """
    Delete a candidate from the database.
    
    Args:
        candidate_id: The candidate's ID
        
    Returns:
        bool: True if deleted successfully
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM candidates WHERE id = ?', (candidate_id,))
        conn.commit()
        return cursor.rowcount > 0


def export_to_csv():
    """
    Export all candidates to CSV format.
    
    Returns:
        str: CSV content as string
    """
    import csv
    from io import StringIO
    
    candidates = get_all_candidates()
    
    if not candidates:
        return "No data to export"
    
    output = StringIO()
    writer = csv.DictWriter(output, fieldnames=candidates[0].keys())
    writer.writeheader()
    writer.writerows(candidates)
    
    return output.getvalue()


if __name__ == '__main__':
    # Initialize database when run directly
    init_database()
